"""
GPT 서비스
GPT를 사용한 프롬프트 개선을 담당합니다.
"""

import os
import sys
import importlib.util

# 경로 주입: /app(평탄화)와 /app/AI(중첩) 모두 지원
_CUR = os.path.abspath(os.path.dirname(__file__))
_ROOT_FLAT = os.path.abspath(os.path.join(_CUR, ".."))           # /app
_ROOT_REPO = os.path.abspath(os.path.join(_CUR, "..", ".."))     # /app/AI
for p in (_ROOT_FLAT, _ROOT_REPO):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from AI.clients.gms_api.gpt import (
        generate_luma_prompt,
        generate_gen4_prompt,
        generate_menuboard_prompt,
        short_image_prompt,
    )
except ModuleNotFoundError:
    try:
        from clients.gms_api.gpt import (
            generate_luma_prompt,
            generate_gen4_prompt,
            generate_menuboard_prompt,
            short_image_prompt,
        )
    except ModuleNotFoundError:
        # 최후의 폴백: 파일 경로로 직접 로드
        _candidates = [
            os.path.join(_ROOT_FLAT, "clients", "gms_api", "gpt.py"),
            os.path.join(_ROOT_REPO, "clients", "gms_api", "gpt.py"),
        ]
        _loaded = False
        for _path in _candidates:
            try:
                if os.path.exists(_path):
                    _spec = importlib.util.spec_from_file_location("_gpt_module", _path)
                    if _spec and _spec.loader:
                        _mod = importlib.util.module_from_spec(_spec)
                        _spec.loader.exec_module(_mod)  # type: ignore[attr-defined]
                        generate_luma_prompt = _mod.generate_luma_prompt
                        generate_gen4_prompt = _mod.generate_gen4_prompt
                        generate_menuboard_prompt = _mod.generate_menuboard_prompt
                        short_image_prompt = _mod.short_image_prompt
                        _loaded = True
                        break
            except Exception:
                continue
        if not _loaded:
            raise



class GPTService:
    @staticmethod
    async def enhance_prompt(original_prompt: str) -> str:
        """
        기본 프롬프트 개선 (하위호환용): Luma(ray-2) 최적화 규칙 사용
        """
        return await generate_luma_prompt(original_prompt)

    @staticmethod
    async def enhance_prompt_for_luma(original_prompt: str) -> str:
        """Luma(ray-2) 전용 프롬프트 보강"""
        return await generate_luma_prompt(original_prompt)

    @staticmethod
    async def enhance_prompt_for_runway(original_prompt: str) -> str:
        """Runway(Gen-4 Turbo) 전용 프롬프트 보강"""
        return await generate_gen4_prompt(original_prompt)

    @staticmethod
    async def enhance_prompt_for_menuboard(original_prompt: str) -> str:
        """메뉴보드 전용 프롬프트 보강"""
        return await generate_menuboard_prompt(original_prompt)

    @staticmethod
    async def enhance_prompt_for_review_image(original_prompt: str) -> str:
        """리뷰 IMAGE 전용 프롬프트 보강 """
        return await short_image_prompt(original_prompt)


# 전역 인스턴스
gpt_service = GPTService()
