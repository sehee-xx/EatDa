import requests
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 환경 변수에서 Luma AI API 키 가져오기
LUMAAI_API_KEY = os.environ.get("LUMAAI_API_KEY")

# API 키가 제대로 로드되었는지 확인
if not LUMAAI_API_KEY:
    print("Error: LUMAAI_API_KEY is not set in your .env file.")
    exit() # 키가 없으면 스크립트 종료

url = "https://api.lumalabs.ai/dream-machine/v1/credits"

headers = {
    "accept": "application/json",
    "authorization": f"Bearer {LUMAAI_API_KEY}"
}

response = requests.get(url, headers=headers)

print(response.text)