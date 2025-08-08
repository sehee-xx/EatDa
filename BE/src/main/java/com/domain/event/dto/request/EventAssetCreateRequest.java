package com.domain.event.dto.request;

import com.global.annotation.ExcludeFromLogging;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public record EventAssetCreateRequest(
        @NotNull(message = "STORE_ID_REQUIRED")
        Long storeId,

        @NotBlank(message = "EVENT_TITLE_REQUIRED")
        String title,

        @NotNull(message = "EVENT_START_DATE_REQUIRED")
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        LocalDate startDate,

        @NotNull(message = "EVENT_END_DATE_REQUIRED")
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        LocalDate endDate,

        @NotBlank(message = "PROMPT_REQUIRED")
        String prompt,

        @NotEmpty(message = "IMAGES_REQUIRED")
        @ExcludeFromLogging
        List<@NotNull MultipartFile> image
) {
}
