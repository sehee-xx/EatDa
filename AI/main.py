import os
import io
import asyncio
import time
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from lumaai import AsyncLumaAI
from gms_api.gpt import generate_luma_prompt
import requests

load_dotenv()  # .env 파일 로드

app = FastAPI(
    title="AI Video Generation API",
    description="Luma AI를 사용한 영상 생성 API 서버",
    version="1.0.0"
)

# CORS 설정 (프론트엔드에서 접근할 수 있도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Luma AI 클라이언트 초기화
try:
    client = AsyncLumaAI(auth_token=os.getenv("LUMAAI_API_KEY"))
    print("✅ Luma AI 클라이언트 초기화 성공")
except Exception as e:
    print(f"⚠️ Luma AI 클라이언트 초기화 실패: {e}")
    client = None

generations = {}  # 메모리에 영상 생성 정보 저장

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    status: str
    message: str
    generation_id: str = None
    enhanced_prompt: str = None

@app.get("/")
async def root():
    """API 서버 상태 확인"""
    return {"message": "AI Video Generation API Server is running! 🚀"}

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy"}

@app.post("/generate", response_model=GenerateResponse)
async def generate_video(request: GenerateRequest):
    """
    영상 생성 요청 - luma.py의 로직을 FastAPI로 구현
    1. 사용자 프롬프트를 gpt.py로 개선
    2. 개선된 프롬프트로 Luma AI 영상 생성 요청
    """
    try:
        if client is None:
            raise HTTPException(
                status_code=500, 
                detail="Luma AI 클라이언트가 초기화되지 않았습니다. API 키를 확인하세요."
            )
        
        print(f"📝 원본 프롬프트: {request.prompt}")
        
        # 1단계: GPT로 프롬프트 개선 (gpt.py 사용)
        print("✨ GPT로 프롬프트를 개선하는 중...")
        detailed_prompt = await generate_luma_prompt(request.prompt)
        print(f"🎯 개선된 프롬프트: {detailed_prompt}")
        
        # 2단계: Luma AI로 영상 생성 요청 (luma.py 로직 사용)
        print("🎬 Luma AI로 영상 생성 요청 중...")
        generation = await client.generations.create(
            prompt=detailed_prompt,
            model="ray-2",
            loop=True,
            aspect_ratio="9:16",
            duration="5s",
            keyframes={
                "frame0": {
                    "type": "image", 
                    "url": "https://storage.googleapis.com/be_my_logo/am_i_being_a_king.jpg"
                }
            }
        )
        
        # 메모리에 생성 정보 저장
        generations[generation.id] = {
            "state": generation.state,
            "original_prompt": request.prompt,
            "enhanced_prompt": detailed_prompt,
            "created_at": time.time()
        }
        
        print(f"✅ 영상 생성 요청 완료! ID: {generation.id}")
        
        return GenerateResponse(
            status="success",
            message="영상 생성 요청이 완료되었습니다! 상태를 확인해주세요.",
            generation_id=generation.id,
            enhanced_prompt=detailed_prompt
        )
        
    except Exception as e:
        print(f"❌ 에러 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=f"영상 생성 중 오류가 발생했습니다: {str(e)}")

@app.get("/status/{generation_id}")
async def get_status(generation_id: str):
    """영상 생성 상태 확인 - luma.py의 polling 로직"""
    try:
        if generation_id not in generations:
            raise HTTPException(status_code=404, detail="생성 ID를 찾을 수 없습니다")
        
        if client is None:
            raise HTTPException(status_code=500, detail="Luma AI 클라이언트가 초기화되지 않았습니다")
        
        # Luma AI에서 최신 상태 가져오기
        generation = await client.generations.get(id=generation_id)
        
        # 메모리에 저장된 정보 업데이트
        generations[generation_id]["state"] = generation.state
        
        response_data = {
            "generation_id": generation_id,
            "state": generation.state,
            "original_prompt": generations[generation_id].get("original_prompt"),
            "enhanced_prompt": generations[generation_id].get("enhanced_prompt")
        }
        
        # 상태에 따른 추가 정보
        if generation.state == "completed":
            response_data["video_url"] = generation.assets.video
            response_data["message"] = "🎉 영상 생성이 완료되었습니다!"
            print(f"✅ 영상 생성 완료: {generation_id}")
        elif generation.state == "failed":
            response_data["failure_reason"] = generation.failure_reason
            response_data["message"] = "❌ 영상 생성이 실패했습니다"
            print(f"❌ 영상 생성 실패: {generation_id}")
        else:
            response_data["message"] = "⏳ 영상 생성 중입니다... (2-5분 소요)"
            print(f"⏳ 영상 생성 중: {generation_id} - {generation.state}")
        
        return response_data
        
    except Exception as e:
        print(f"❌ 상태 확인 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"상태 확인 중 오류가 발생했습니다: {str(e)}")

@app.get("/video/{generation_id}")
async def download_video(generation_id: str):
    """완성된 영상 다운로드 - luma.py의 다운로드 로직"""
    try:
        if generation_id not in generations:
            raise HTTPException(status_code=404, detail="생성 ID를 찾을 수 없습니다")
        
        if client is None:
            raise HTTPException(status_code=500, detail="Luma AI 클라이언트가 초기화되지 않았습니다")
        
        generation = await client.generations.get(id=generation_id)
        
        if generation.state != "completed":
            raise HTTPException(
                status_code=400, 
                detail=f"영상이 아직 완성되지 않았습니다. 현재 상태: {generation.state}"
            )
        
        video_url = generation.assets.video
        print(f"📥 영상 다운로드 시작: {video_url}")
        
        # 영상 파일 스트리밍 다운로드
        response = requests.get(video_url, stream=True)
        response.raise_for_status()
        
        return StreamingResponse(
            io.BytesIO(response.content), 
            media_type="video/mp4",
            headers={"Content-Disposition": f"attachment; filename={generation_id}.mp4"}
        )
        
    except Exception as e:
        print(f"❌ 영상 다운로드 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"영상 다운로드 중 오류가 발생했습니다: {str(e)}")

@app.get("/generations")
async def list_generations():
    """생성된 영상 목록 조회"""
    return {
        "total": len(generations),
        "generations": [
            {
                "id": gen_id,
                "state": info["state"],
                "original_prompt": info.get("original_prompt"),
                "created_at": info.get("created_at")
            }
            for gen_id, info in generations.items()
        ]
    }

# 서버 실행 (개발용)
if __name__ == "__main__":
    import uvicorn
    print("🚀 AI Video Generation API 서버를 시작합니다...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
