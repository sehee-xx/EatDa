"""
FastAPI 테스트 유틸: 로컬 파일 경로 존재/읽기 가능 여부 점검
"""

from __future__ import annotations

import os
import mimetypes
from typing import List, Dict, Any

from fastapi import APIRouter, HTTPException, Query


router = APIRouter(prefix="/api/test/fs", tags=["fs-test"], include_in_schema=True)


def _inspect_path(path: str) -> Dict[str, Any]:
    try:
        exists = os.path.exists(path)
        is_file = os.path.isfile(path)
        size = os.path.getsize(path) if exists and is_file else None
        mime, _ = mimetypes.guess_type(path)
        readable = False
        if exists and is_file:
            try:
                with open(path, "rb") as f:  # noqa: PTH123
                    _ = f.read(1)
                readable = True
            except Exception:
                readable = False
        return {
            "path": path,
            "exists": bool(exists),
            "isFile": bool(is_file),
            "size": size,
            "mime": mime or None,
            "readable": readable,
        }
    except Exception as e:
        return {"path": path, "error": str(e)}


@router.get("/exists")
async def check_exists(path: str = Query(..., description="점검할 로컬 파일 경로")) -> Dict[str, Any]:
    return _inspect_path(path)


@router.post("/exists-batch")
async def check_exists_batch(paths: List[str]) -> Dict[str, Any]:
    if not isinstance(paths, list) or not paths:
        raise HTTPException(status_code=400, detail="paths 배열이 필요합니다.")
    return {"results": [_inspect_path(p) for p in paths]}


