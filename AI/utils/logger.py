"""
로깅 유틸리티
공통 로깅 기능을 제공합니다.
"""

import logging
import sys
from datetime import datetime


def setup_logger(name: str = "ai_api", level: int = logging.INFO) -> logging.Logger:
    """
    로거를 설정합니다.
    
    Args:
        name (str): 로거 이름
        level (int): 로깅 레벨
        
    Returns:
        logging.Logger: 설정된 로거
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # 핸들러가 이미 있으면 추가하지 않음
    if not logger.handlers:
        # 콘솔 핸들러 생성
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        
        # 포매터 생성
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(formatter)
        
        # 핸들러를 로거에 추가
        logger.addHandler(console_handler)
    
    return logger


def log_request(logger: logging.Logger, request_data: dict):
    """요청 데이터를 로깅합니다."""
    logger.info(f"Request received: {request_data}")


def log_response(logger: logging.Logger, response_data: dict):
    """응답 데이터를 로깅합니다."""
    logger.info(f"Response sent: {response_data}")


def log_error(logger: logging.Logger, error: Exception, context: str = ""):
    """에러를 로깅합니다."""
    logger.error(f"Error in {context}: {str(error)}", exc_info=True)


# 기본 로거 인스턴스
default_logger = setup_logger()
