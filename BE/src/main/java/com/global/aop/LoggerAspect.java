package com.global.aop;

import static com.global.constants.Messages.APACHE_PACKAGE;
import static com.global.constants.Messages.LOG_ARG_CONVERSION_FAILED;
import static com.global.constants.Messages.SPRING_PACKAGE;
import static org.springframework.boot.logging.LogLevel.DEBUG;
import static org.springframework.boot.logging.LogLevel.INFO;
import static org.springframework.boot.logging.LogLevel.TRACE;

import java.util.Arrays;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.boot.logging.LogLevel;
import org.springframework.stereotype.Component;

@Aspect
@Slf4j
@Component
@RequiredArgsConstructor
public class LoggerAspect {
    // 포인트컷용 상수
    public static final String CONTROLLER_PATTERN = "execution(* com.global..*Controller.*(..))";
    public static final String SERVICE_PATTERN = "execution(* com.global..*.service.*(..))";
    public static final String REPOSITORY_PATTERN = "execution(* com.global..*.repository.*(..))";

    private final LogTrace logTrace;

    // ======= Pointcut =======

    @Pointcut(CONTROLLER_PATTERN)
    private void controllerLayer() {
    }

    @Pointcut(SERVICE_PATTERN)
    private void serviceLayer() {
    }

    @Pointcut(REPOSITORY_PATTERN)
    private void repositoryLayer() {
    }

    // ======= Around per Layer =======

    @Around("controllerLayer()")
    public Object logController(final ProceedingJoinPoint joinPoint) throws Throwable {
        return executeWithLevel(joinPoint, INFO);
    }

    @Around("serviceLayer()")
    public Object logService(final ProceedingJoinPoint joinPoint) throws Throwable {
        return executeWithLevel(joinPoint, DEBUG);
    }

    @Around("repositoryLayer()")
    public Object logRepository(final ProceedingJoinPoint joinPoint) throws Throwable {
        return executeWithLevel(joinPoint, TRACE);
    }

    // ======= Execution Handler =======

    /**
     * 주어진 로그 레벨로 메서드 실행을 처리하고 로깅합니다.
     */
    private Object executeWithLevel(final ProceedingJoinPoint joinPoint, final LogLevel level) throws Throwable {
        TraceStatus status = null;
        try {
            String methodSignature = createMethodSignature(joinPoint);
            status = logTrace.begin(methodSignature, level);
            Object result = joinPoint.proceed();
            logTrace.end(status, level);
            return result;
        } catch (Exception e) {
            logTrace.exception(status, e, level);
            throw e;
        }
    }

    /**
     * 메서드 시그니처 문자열 `클래스명.메서드명(파라미터들)`을 생성합니다.
     */
    private String createMethodSignature(final ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        String args = Arrays.stream(joinPoint.getArgs())
                .filter(this::isValidArgument)
                .map(this::convertArgToString)
                .collect(Collectors.joining(", "));

        return String.format("%s.%s(%s)", className, methodName, args);
    }

    /**
     * 유효(null이 아니고 spring/apache 패키지가 아닌 경우)한 인자인지 확인합니다.
     */
    private boolean isValidArgument(final Object arg) {
        return arg != null && !isSpringOrApachePackage(arg.getClass().getName());
    }

    /**
     * 주어진 클래스가 스프링 또는 아파치 패키지에 속하는지 확인합니다.
     */
    private boolean isSpringOrApachePackage(final String className) {
        return className.startsWith(SPRING_PACKAGE.message())
                || className.startsWith(APACHE_PACKAGE.message());
    }

    /**
     * 인자를 문자열로 변환합니다(변환 실패 시 기본 에러 메시지를 반환)
     */
    private String convertArgToString(final Object arg) {
        try {
            return arg.toString();
        } catch (Exception e) {
            return LOG_ARG_CONVERSION_FAILED.message();
        }
    }
}
