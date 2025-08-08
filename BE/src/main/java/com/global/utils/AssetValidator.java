package com.global.utils;

import com.global.constants.ErrorCode;
import com.global.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
public class AssetValidator {
    private static final long MAX_IMAGE_SIZE_MB = 10;
    private static final int IMAGE_BYTE = 1024;

    private static final String LOG_IMAGE_TOO_LARGE =
            "[AssetValidator] 이미지 크기 초과 - filename: {}, size: {}MB";

    public static void validateImages(final List<MultipartFile> images, ErrorCode errorCode) throws ApiException {
        for (MultipartFile file : images) {
            if (file.getSize() > MAX_IMAGE_SIZE_MB * IMAGE_BYTE * IMAGE_BYTE) {
                log.warn(LOG_IMAGE_TOO_LARGE, file.getOriginalFilename(), file.getSize() / (IMAGE_BYTE * IMAGE_BYTE));
                throw new ApiException(errorCode, file.getOriginalFilename());
            }
        }
    }
}
