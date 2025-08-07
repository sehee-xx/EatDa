"""
Routers package
"""

from .generate import router as generate_router
from .ocr import router as ocr_router

__all__ = ["generate_router", "ocr_router"]
