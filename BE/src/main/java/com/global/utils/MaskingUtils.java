package com.global.utils;

import static com.global.constants.Messages.UTILITY_CLASS_ERROR;

import com.global.annotation.Sensitive;
import java.lang.reflect.Field;
import java.util.StringJoiner;

/**
 * 민감 정보(@Sensitive)를 포함한 객체에 대해 마스킹된 문자열로 변환하는 유틸리티 클래스입니다.
 */
public final class MaskingUtils {

    private static final String MASK = "****";

    private MaskingUtils() {
        throw new IllegalStateException(UTILITY_CLASS_ERROR.message());
    }

    /**
     * 대상 객체의 필드 중 @Sensitive 어노테이션이 붙은 항목을 마스킹 처리하여 문자열로 반환합니다.
     */
    public static String mask(final Object target) {
        if (target == null) {
            return "null";
        }

        Class<?> clazz = target.getClass();
        Field[] fields = clazz.getDeclaredFields();

        return getString(target, clazz, fields);
    }

    /**
     * 객체의 필드 정보를 문자열로 변환하여 반환합니다.
     */
    private static String getString(final Object target, final Class<?> clazz, final Field[] fields) {
        StringJoiner result = new StringJoiner(", ", clazz.getSimpleName() + "[", "]");

        for (Field field : fields) {
            result.add(formatField(field, target));
        }

        return result.toString();
    }

    /**
     * 필드를 마스킹 여부에 따라 문자열로 변환합니다.
     */
    private static String formatField(final Field field, final Object target) {
        field.setAccessible(true);
        try {
            Object value = field.get(target);
            boolean isSensitive = field.isAnnotationPresent(Sensitive.class);
            String displayValue = isSensitive ? MASK : String.valueOf(value);
            return field.getName() + "=" + displayValue;
        } catch (IllegalAccessException e) {
            return field.getName() + "=<error>";
        }
    }
}
