"""
Routers package
"""
from .ocr import router as ocr_router
from .stream_test import router as stream_test_router

__all__ = ["ocr_router", "stream_test_router"]
