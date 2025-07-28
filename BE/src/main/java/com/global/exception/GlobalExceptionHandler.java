package com.global.exception;

import com.global.constants.ErrorCode;
import com.global.dto.response.BaseResponse;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 핸들러 - 서비스 전체에서 발생하는 예외를 일관된 형식으로 처리한다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 비즈니스 예외 처리
     */
    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<BaseResponse<Void>> handleGlobalException(final GlobalException e) {
        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(BaseResponse.error(e.getErrorCode(), e.getDetails()));
    }

    /**
     * @Valid, @Validated 유효성 검증 실패 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Void>> handleValidationException(final MethodArgumentNotValidException e) {
        Map<String, String> details = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
                details.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity
                .status(ErrorCode.VALIDATION_ERROR.getStatus())
                .body(BaseResponse.error(ErrorCode.VALIDATION_ERROR, details));
    }

    /**
     * URI 파라미터 등의 제약조건 검증 실패 처리
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<BaseResponse<Void>> handleConstraintViolationException(final ConstraintViolationException e) {
        Map<String, String> details = new HashMap<>();
        e.getConstraintViolations().forEach(violation ->
                details.put(violation.getPropertyPath().toString(), violation.getMessage()));

        return ResponseEntity
                .status(ErrorCode.VALIDATION_ERROR.getStatus())
                .body(BaseResponse.error(ErrorCode.VALIDATION_ERROR, details));
    }

    /**
     * 잘못된 JSON 형식 등 본문 파싱 실패
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<BaseResponse<Void>> handleInvalidFormat(final HttpMessageNotReadableException e) {
        return ResponseEntity
                .status(ErrorCode.INVALID_FORMAT.getStatus())
                .body(BaseResponse.error(ErrorCode.INVALID_FORMAT));
    }

    /**
     * 허용되지 않은 HTTP 메서드 요청 처리
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<BaseResponse<Void>> handleMethodNotAllowed(final HttpRequestMethodNotSupportedException e) {
        return ResponseEntity
                .status(ErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(BaseResponse.error(ErrorCode.METHOD_NOT_ALLOWED));
    }

    /**
     * 정의되지 않은 모든 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleUncaughtException(final Exception e) {
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(BaseResponse.error(ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
