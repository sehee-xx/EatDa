package com.global.filestorage;

import static com.global.constants.ErrorCode.IMAGE_PROCESSING_FAILED;
import static com.global.filestorage.constants.FileStorageConstants.DEFAULT_IMAGE_QUALITY;
import static com.global.filestorage.constants.FileStorageConstants.DEFAULT_IMAGE_WIDTH;
import static com.global.filestorage.constants.FileStorageConstants.EXCEPTION_DECODING_FAILED;
import static com.global.filestorage.constants.FileStorageConstants.EXCEPTION_ENCODER_NOT_FOUND;
import static com.global.filestorage.constants.FileStorageConstants.EXCEPTION_ENCODING_FAILED;
import static com.global.filestorage.constants.FileStorageConstants.IMAGE_OPTIMIZER_DECODING_FAILED;
import static com.global.filestorage.constants.FileStorageConstants.IMAGE_OPTIMIZER_ENCODER_NOT_FOUND;
import static com.global.filestorage.constants.FileStorageConstants.IMAGE_OPTIMIZER_ENCODING_FAILED;
import static com.global.filestorage.constants.FileStorageConstants.IMAGE_OPTIMIZER_UNEXPECTED_ERROR;

import com.global.exception.GlobalException;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import javax.imageio.ImageIO;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이미지 리사이징 및 포맷 변환 모듈
 */
@Slf4j
@Component
public class ImageOptimizer {

    /**
     * 이미지를 리사이징하고 주어진 포맷으로 변환
     *
     * @param file   원본 MultipartFile 이미지
     * @param format 저장할 이미지 포맷 (예: "AVIF", "JPEG")
     * @return 변환된 이미지 InputStream
     */
    public InputStream optimize(final MultipartFile file, final String format) {
        try {
            // 지원하지 않는 포맷인 경우 로그 후 예외 발생
            if (!isFormatSupported(format)) {
                log.error(IMAGE_OPTIMIZER_ENCODER_NOT_FOUND, format);
                throw new IOException(String.format(EXCEPTION_ENCODER_NOT_FOUND, format));
            }

            // 이미지 디코딩 실패 시 예외 처리
            BufferedImage original = ImageIO.read(file.getInputStream());
            if (Objects.isNull(original)) {
                log.error(IMAGE_OPTIMIZER_DECODING_FAILED, file.getOriginalFilename());
                throw new IOException(String.format(EXCEPTION_DECODING_FAILED, file.getOriginalFilename()));
            }

            // 이미지 리사이징 및 품질 조정
            BufferedImage resized = Thumbnails.of(original)
                    .width(DEFAULT_IMAGE_WIDTH)
                    .outputQuality(DEFAULT_IMAGE_QUALITY)
                    .asBufferedImage();

            // 리사이징된 이미지를 지정한 포맷으로 인코딩
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            boolean success = ImageIO.write(resized, format, baos);
            if (!success) {
                log.error(IMAGE_OPTIMIZER_ENCODING_FAILED, format, file.getOriginalFilename());
                throw new IOException(
                        String.format(EXCEPTION_ENCODING_FAILED, format, file.getOriginalFilename()));
            }

            return new ByteArrayInputStream(baos.toByteArray());
        } catch (IOException e) {
            log.error(IMAGE_OPTIMIZER_UNEXPECTED_ERROR, format, file.getOriginalFilename(), e.getMessage());
            throw new GlobalException(IMAGE_PROCESSING_FAILED, file.getOriginalFilename() + " : " + e.getMessage(), e);
        }
    }

    /**
     * 지정된 포맷에 대한 ImageIO 인코더 지원 여부를 확인합니다.
     *
     * @param format 확인할 이미지 포맷
     * @return 지원 여부
     */
    private boolean isFormatSupported(String format) {
        return ImageIO.getImageWritersByFormatName(format).hasNext();
    }
}
