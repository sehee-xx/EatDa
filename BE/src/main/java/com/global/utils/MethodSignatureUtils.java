package com.global.utils;

import static com.global.constants.Messages.APACHE_PACKAGE;
import static com.global.constants.Messages.LOGGING_EXCLUDED_MESSAGE;
import static com.global.constants.Messages.LOG_ARG_CONVERSION_FAILED;
import static com.global.constants.Messages.SPRING_PACKAGE;
import static com.global.constants.Messages.UTILITY_CLASS_ERROR;

import com.global.annotation.ExcludeFromLogging;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;

public final class MethodSignatureUtils {

    private MethodSignatureUtils() {
        throw new IllegalStateException(UTILITY_CLASS_ERROR.message());
    }

    /**
     * 메서드 시그니처 문자열 `클래스명.메서드명(파라미터들)`을 생성합니다.
     */
    public static String formatMethodSignature(final ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        String args = Arrays.stream(joinPoint.getArgs())
                .filter(MethodSignatureUtils::isValidArgument)
                .map(MethodSignatureUtils::convertArgToString)
                .collect(Collectors.joining(", "));

        return String.format("%s.%s(%s)", className, methodName, args);
    }

    /**
     * 유효(null이 아니고 spring/apache 패키지가 아닌 경우)한 인자인지 확인합니다.
     */
    private static boolean isValidArgument(final Object arg) {
        return arg != null && !isSpringOrApachePackage(arg.getClass().getName());
    }

    /**
     * 주어진 클래스가 스프링 또는 아파치 패키지에 속하는지 확인합니다.
     */
    private static boolean isSpringOrApachePackage(final String className) {
        return className.startsWith(SPRING_PACKAGE.message())
                || className.startsWith(APACHE_PACKAGE.message());
    }

    /**
     * 인자를 문자열로 변환하고 마스킹 처리합니다.
     */
    private static String convertArgToString(final Object arg) {
        try {
            // @ExcludeFromLogging 어노테이션이 있는 경우 제외 
            if (arg.getClass().isAnnotationPresent(ExcludeFromLogging.class)) {
                return LOGGING_EXCLUDED_MESSAGE.message();
            }

            // MaskingUtils를 통한 마스킹 처리
            return MaskingUtils.mask(arg);
        } catch (Exception e) {
            return LOG_ARG_CONVERSION_FAILED.message();
        }
    }
}
