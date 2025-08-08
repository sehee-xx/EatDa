package com.domain.review.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SeoulLocationValidator.class)
@Documented
public @interface SeoulLocation {
    String message() default "좌표는 서울 지역 범위여야 합니다";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    LocationType type();

    enum LocationType {
        LATITUDE, LONGITUDE
    }
}
