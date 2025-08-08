"""
OCR 서비스
메뉴보드 이미지 OCR 처리를 담당합니다.
"""

import httpx
import json
import re
import time
import uuid
from dotenv import load_dotenv
import os
from typing import List, Tuple, Optional
from models.ocr_menuboard_models import ClovaOCRRequest, ClovaImageSpec, ExtractedMenu

# 환경 변수 로드
load_dotenv()

class OCRMenuBoardService:
    def __init__(self):
        self.secret_key = os.environ.get("CLOVA_MENU_SECRET_KEY")
        self.api_url = os.environ.get("CLOVA_MENU_API_URL")
        
        if not self.secret_key or not self.api_url:
            raise ValueError("CLOVA OCR API 설정이 누락되었습니다. 환경변수를 확인하세요.")
    
    @staticmethod
    def is_hangul(s: str) -> bool:
        """문자열에 한글 글자가 있으면 True를 반환합니다."""
        return any('\uac00' <= ch <= '\ud7a3' for ch in s)
    
    @staticmethod
    def is_price(s: str) -> bool:
        """문자열이 가격 형식인지 확인합니다 (숫자, 소수점, 콤마 허용)."""
        return re.match(r'^\d+([.,]\d+)?$', s) is not None
    
    def _parse_price(self, price_str: str) -> Optional[int]:
        """가격 문자열을 정수로 파싱합니다."""
        raw = price_str.strip()
        
        # 소수점 한 자리(예: "8.0")는 천 단위 구분자로 간주
        if re.match(r'^\d+\.\d$', raw):
            return int(float(raw) * 1000)
        else:
            # 콤마 제거 후 정수로 변환
            try:
                return int(raw.replace(",", ""))
            except ValueError:
                return None
    
    async def call_clova_ocr(self, image_data: bytes, image_format: str = "jpg") -> dict:
        """
        Clova OCR API를 호출합니다.
        
        Args:
            image_data (bytes): 이미지 바이너리 데이터
            image_format (str): 이미지 포맷 (jpg, png 등)
            
        Returns:
            dict: OCR API 응답 결과
        """
        # 지원되는 확장자 검증 및 정규화
        normalized_format = (image_format or "").strip().lower()
        # 확장자 정규화 맵
        normalization_map = {
            "jpeg": "jpg",
            "tif": "tiff",
        }
        normalized_format = normalization_map.get(normalized_format, normalized_format)
        allowed_formats = {"jpg", "png", "pdf", "tiff"}
        if normalized_format not in allowed_formats:
            raise ValueError(
                f"지원하지 않는 이미지 형식입니다: {image_format}. 지원 형식: {sorted(list(allowed_formats))}"
            )
        
        # OCR 요청 데이터 구성
        request_payload = ClovaOCRRequest(
            images=[ClovaImageSpec(format=normalized_format, name="menu_board")],
            requestId=str(uuid.uuid4()),
            version="V2",
            timestamp=int(time.time() * 1000)
        )
        
        # API 요청 준비
        files = [("file", image_data)]
        payload = {"message": json.dumps(request_payload.model_dump()).encode("utf-8")}
        headers = {"X-OCR-SECRET": self.secret_key}
        
        # POST 요청으로 OCR API 호출
        async with httpx.AsyncClient() as client:
            resp = await client.post(self.api_url, headers=headers, data=payload, files=files)
            resp.raise_for_status()
        
        return resp.json()
    
    def _group_fields_by_line(self, fields: List[dict]) -> List[List[dict]]:
        """
        OCR 결과 fields를 lineBreak 기준으로 그룹화합니다.
        
        Args:
            fields (List[dict]): OCR API에서 반환된 fields 리스트
            
        Returns:
            List[List[dict]]: 줄별로 그룹화된 fields
        """
        groups, curr = [], []
        for fld in fields:
            curr.append(fld)
            if fld.get("lineBreak", False):
                groups.append(curr)
                curr = []
        if curr:
            groups.append(curr)
        return groups
    
    def _extract_menu_prices(self, groups: List[List[dict]]) -> List[Tuple[str, str]]:
        """
        그룹화된 fields에서 메뉴명과 가격을 추출합니다.
        
        Args:
            groups (List[List[dict]]): 줄별로 그룹화된 fields
            
        Returns:
            List[Tuple[str, str]]: (메뉴명, 가격) 튜플 리스트
        """
        menu_prices = []
        
        for grp in groups:
            texts = [f["inferText"].strip() for f in grp]
            if not texts or not self.is_hangul(texts[0]):
                continue

            # 기본 메뉴 + 가격
            if len(texts) >= 2 and self.is_price(texts[1]):
                menu_prices.append((texts[0], texts[1]))

            # Hot/Ice 옵션
            if len(texts) >= 4 and self.is_hangul(texts[2]) and self.is_price(texts[3]):
                menu_prices.append((f"{texts[2]} (Hot)", texts[3]))
                if len(texts) >= 5 and self.is_price(texts[4]):
                    menu_prices.append((f"{texts[2]} (Ice)", texts[4]))
        
        return menu_prices
    
    async def extract_menus_from_image(self, image_data: bytes, image_format: str = "jpg") -> List[ExtractedMenu]:
        """
        이미지에서 메뉴 정보를 추출합니다.
        
        Args:
            image_data (bytes): 이미지 바이너리 데이터
            image_format (str): 이미지 포맷
            
        Returns:
            List[ExtractedMenu]: 추출된 메뉴 리스트
        """
        # 1단계: Clova OCR API 호출
        ocr_result = await self.call_clova_ocr(image_data, image_format)
        
        # 2단계: fields 그룹화 (lineBreak 기준)
        fields = ocr_result["images"][0]["fields"]
        groups = self._group_fields_by_line(fields)
        
        # 3단계: 메뉴명-가격 파싱
        menu_prices = self._extract_menu_prices(groups)
        
        # 4단계: ExtractedMenu 객체로 변환
        extracted_menus = []
        for name, price_str in menu_prices:
            price = self._parse_price(price_str)
            extracted_menus.append(ExtractedMenu(name=name, price=price))
        
        return extracted_menus
    
    def is_available(self) -> bool:
        """OCR 서비스가 사용 가능한지 확인합니다."""
        return bool(self.secret_key and self.api_url)


# 전역 인스턴스
ocr_menuboard_service = OCRMenuBoardService()
