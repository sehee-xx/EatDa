"""
OCR 영수증 인증 요청 모델 (Redis Stream 용)
기존 ocr_receipt_models 를 대체
"""

from __future__ import annotations

from datetime import datetime
from typing import Dict, Literal, Optional

from pydantic import BaseModel, Field, HttpUrl


class OCRReceiptVerificationMessage(BaseModel):
    sourceId: int = Field(..., description="OCR 요청 식별자 (asset_source.id)")
    storeId: int = Field(..., description="인증 대상 가게 ID")
    userId: int = Field(..., description="요청 사용자 ID")
    imageUrl: HttpUrl = Field(..., description="업로드된 영수증 이미지 URL")
    requestedAt: datetime = Field(..., description="요청 시각 (ISO8601)")
    expireAt: datetime = Field(..., description="만료 시각 (ISO8601)")
    retryCount: int = Field(0, description="재시도 횟수 (기본 0)")

    def to_xadd_fields(self, mode: Literal["json", "kv"] = "json") -> Dict[str, str]:
        if mode == "json":
            return {"payload": self.model_dump_json()}
        data = self.model_dump()
        data["requestedAt"] = self.requestedAt.isoformat()
        data["expireAt"] = self.expireAt.isoformat()
        return {k: str(v) for k, v in data.items()}


class OCRReceiptCallbackRequest(BaseModel):
    sourceId: int = Field(..., description="OCR 요청 식별자 (asset_source.id)")
    result: Literal["SUCCESS", "FAIL"] = Field(..., description="생성 결과")
    extractedAddress: Optional[str] = Field(None, description="OCR로 추출된 주소 문자열 (실패시 null)")


__all__ = [
    "STREAM_KEY_OCR_RECEIPT_REQUEST",
    "OCRReceiptVerificationMessage",
    "OCRReceiptCallbackRequest",
]


