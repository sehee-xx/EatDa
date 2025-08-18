import os
import base64
import asyncio
from typing import Optional
import httpx
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()


def _get_required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"환경변수 {name} 가 설정되어 있지 않습니다. .env 또는 실행 환경에 키를 설정하세요.")
    return value


async def generate_and_save_image(
    prompt: str,
    *,
    size: str = "1024x1024",
    model: str = "dall-e-3",
    output_path: str = "output.png",
    ) -> str:
    """
    Returns: 저장된 파일 경로
    """
    api_key = _get_required_env("GMS_API_KEY")
    base_url = os.environ.get("GMS_BASE_URL", "https://gms.ssafy.io/gmsapi/api.openai.com/v1")

    client = AsyncOpenAI(api_key=api_key, base_url=base_url)

    # 일부 프록시는 기본값이 URL 응답일 수 있으므로 b64_json을 명시적으로 요청
    try:
        resp = await client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            response_format="b64_json",  # 지원 안 해도 무시되며, 지원 시 b64_json 반환
        )
    except Exception as e:
        # 에러 내용을 보여주고 다시 올림
        raise RuntimeError(f"이미지 생성 호출 실패: {e}")

    # SDK 객체/딕셔너리 모두 대응
    data0 = None
    try:
        data0 = resp.data[0]
    except Exception:
        # dict 형태로 오는 경우
        data0 = (resp.get("data", [None])[0]) if isinstance(resp, dict) else None

    b64: Optional[str] = None
    url: Optional[str] = None
    if data0 is not None:
        b64 = getattr(data0, "b64_json", None) if not isinstance(data0, dict) else data0.get("b64_json")
        url = getattr(data0, "url", None) if not isinstance(data0, dict) else data0.get("url")

    if b64:
        image_bytes = base64.b64decode(b64)
    elif url:
        # URL 응답이면 다운로드
        async with httpx.AsyncClient() as http:
            r = await http.get(url)
            r.raise_for_status()
            image_bytes = r.content
    else:
        # 응답 구조를 출력해 원인 파악에 도움
        raise RuntimeError(f"이미지 응답에 b64_json도 url도 없습니다. resp={getattr(resp, 'model_dump', lambda: str(resp))() if hasattr(resp, 'model_dump') else str(resp)}")

    with open(output_path, "wb") as f:
        f.write(image_bytes)
    return output_path


if __name__ == "__main__":
    # 간단 실행: 기본 프롬프트로 생성
    async def _main():
        saved = await generate_and_save_image("A surreal illustration of a cat set against the backdrop of space.")
        print(f"이미지 저장 완료: {saved}")

    asyncio.run(_main())


# 답변 예시
"""
{
  "created": 1713833628,
  "data": [
    {
      "b64_json": "..."
    }
  ],
  "background": "transparent",
  "output_format": "png",
  "size": "1024x1024",
  "quality": "high",
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
"""