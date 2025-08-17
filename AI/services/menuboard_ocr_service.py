"""
menuboard_ocr 서비스 
"""

import httpx
import json
import re
import time
import uuid
from dotenv import load_dotenv
import os
from typing import List, Tuple, Optional
try:
	from AI.models.menuboard_ocr_models import ClovaOCRRequest, ClovaImageSpec, ExtractedMenu
except ModuleNotFoundError:
	from models.menuboard_ocr_models import ClovaOCRRequest, ClovaImageSpec, ExtractedMenu


load_dotenv()


class MenuboardOCRService:
    def __init__(self):
        self.secret_key = os.environ.get("CLOVA_MENU_SECRET_KEY")
        self.api_url = os.environ.get("CLOVA_MENU_API_URL")
        if not self.secret_key or not self.api_url:
            raise ValueError("CLOVA OCR API 설정이 누락되었습니다. 환경변수를 확인하세요.")

    @staticmethod
    def is_hangul(s: str) -> bool:
        return any("\uac00" <= ch <= "\ud7a3" for ch in s)

    @staticmethod
    def is_price(s: str) -> bool:
        return re.match(r"^\d+([.,]\d+)?$", s) is not None

    def _parse_price(self, price_str: str) -> Optional[int]:
        raw = price_str.strip()
        if re.match(r"^\d+\.\d$", raw):
            return int(float(raw) * 1000)
        try:
            return int(raw.replace(",", ""))
        except ValueError:
            return None

    async def call_clova_ocr(self, image_data: bytes, image_format: str = "jpg") -> dict:
        normalized_format = (image_format or "").strip().lower()
        normalization_map = {"jpeg": "jpg", "tif": "tiff"}
        normalized_format = normalization_map.get(normalized_format, normalized_format)
        allowed_formats = {"jpg", "png", "pdf", "tiff"}
        if normalized_format not in allowed_formats:
            raise ValueError(f"지원하지 않는 이미지 형식입니다: {image_format}. 지원 형식: {sorted(list(allowed_formats))}")

        request_payload = ClovaOCRRequest(
            images=[ClovaImageSpec(format=normalized_format, name="menu_board")],
            requestId=str(uuid.uuid4()),
            version="V2",
            timestamp=int(time.time() * 1000),
        )

        files = [("file", image_data)]
        payload = {"message": json.dumps(request_payload.model_dump()).encode("utf-8")}
        headers = {"X-OCR-SECRET": self.secret_key}

        async with httpx.AsyncClient() as client:
            resp = await client.post(self.api_url, headers=headers, data=payload, files=files)
            resp.raise_for_status()
        return resp.json()

    def _group_fields_by_line(self, fields: List[dict]) -> List[List[dict]]:
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
        menu_prices: List[Tuple[str, str]] = []
        for grp in groups:
            texts = [f["inferText"].strip() for f in grp]
            if not texts or not self.is_hangul(texts[0]):
                continue
            if len(texts) >= 2 and self.is_price(texts[1]):
                menu_prices.append((texts[0], texts[1]))
            if len(texts) >= 4 and self.is_hangul(texts[2]) and self.is_price(texts[3]):
                menu_prices.append((f"{texts[2]} (Hot)", texts[3]))
                if len(texts) >= 5 and self.is_price(texts[4]):
                    menu_prices.append((f"{texts[2]} (Ice)", texts[4]))
        return menu_prices

    async def extract_menus_from_image(self, image_data: bytes, image_format: str = "jpg") -> List[ExtractedMenu]:
        ocr_result = await self.call_clova_ocr(image_data, image_format)
        fields = ocr_result["images"][0]["fields"]
        groups = self._group_fields_by_line(fields)
        menu_prices = self._extract_menu_prices(groups)
        extracted_menus: List[ExtractedMenu] = []
        for name, price_str in menu_prices:
            price = self._parse_price(price_str)
            extracted_menus.append(ExtractedMenu(name=name, price=price))
        return extracted_menus

    def is_available(self) -> bool:
        return bool(self.secret_key and self.api_url)


menuboard_ocr_service = MenuboardOCRService()


