"""
Routers package
"""
from .stream_test import router as stream_test_router
from .menuboard_ocr import router as menuboard_ocr_router

__all__ =  ["stream_test_router", "menuboard_ocr_router"]
