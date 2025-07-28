package com.global.constants;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // 공통 에러
    VALIDATION_ERROR("VALIDATION_ERROR", "입력값이 유효하지 않습니다.", HttpStatus.BAD_REQUEST.value()),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            HttpStatus.INTERNAL_SERVER_ERROR.value()),

    // 인증/인가 관련
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "이메일 또는 비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED.value()),
    KAKAO_TOKEN_INVALID("KAKAO_TOKEN_INVALID", "유효하지 않은 카카오 토큰입니다.", HttpStatus.UNAUTHORIZED.value()),
    GOOGLE_TOKEN_INVALID("GOOGLE_TOKEN_INVALID", "유효하지 않은 구글 토큰입니다.", HttpStatus.UNAUTHORIZED.value()),
    REFRESH_TOKEN_INVALID("REFRESH_TOKEN_INVALID", "유효하지 않거나 만료된 리프레시 토큰입니다.", HttpStatus.UNAUTHORIZED.value()),
    UNAUTHORIZED("UNAUTHORIZED", "인증이 필요합니다.", HttpStatus.UNAUTHORIZED.value()),
    FORBIDDEN("FORBIDDEN", "접근 권한이 없습니다.", HttpStatus.FORBIDDEN.value()),

    // 리소스 관련
    NOT_FOUND("NOT_FOUND", "요청한 파일이 존재하지 않습니다.", HttpStatus.NOT_FOUND.value());

    private final String code;
    private final String message;
    private final int status;

    ErrorCode(final String code, final String message, final int status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
