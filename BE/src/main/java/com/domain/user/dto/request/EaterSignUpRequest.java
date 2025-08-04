package com.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record EaterSignUpRequest(

        @NotBlank(message = "EMAIL_REQUIRED")
        @Email(message = "EMAIL_INVALID_FORMAT")
        String email,

        @NotBlank(message = "PASSWORD_REQUIRED")
        @Size(min = 8, message = "PASSWORD_TOO_SHORT")
        String password,

        @NotBlank(message = "PASSWORD_CONFIRM_REQUIRED")
        String passwordConfirm,

        @NotBlank(message = "NICKNAME_REQUIRED")
        String nickname,

        List<Integer> foodTagIds,

        @Size(max = 50, message = "CUSTOM_FOOD_TAG_TOO_LONG")
        String customFoodTag

) {
}
