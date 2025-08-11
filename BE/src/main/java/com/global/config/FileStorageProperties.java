package com.global.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "filestorage")
@Getter
@Setter
public class FileStorageProperties {

    private static final String DATA_PATH = "data";
    private static final String IMAGES_PATH = "images";
    private static final String VIDEOS_PATH = "videos";

    private String baseDir;
    private String publicBaseUrl;

    public String getImageRoot() {
        return Paths.get(baseDir, DATA_PATH, IMAGES_PATH)
                .toAbsolutePath().normalize().toString();
    }

    public String getVideoRoot() {
        return Paths.get(baseDir, DATA_PATH, VIDEOS_PATH)
                .toAbsolutePath().normalize().toString();
    }

    public String toResponsePath(final String absolutePath) {
        if (publicBaseUrl == null || publicBaseUrl.isBlank()) {
            // local: 절대경로 그대로
            return absolutePath;
        }

        final Path abs  = Paths.get(absolutePath).toAbsolutePath().normalize();
        final Path base = Paths.get(java.util.Objects.requireNonNull(baseDir, "filestorage.base-dir is null"))
                .toAbsolutePath().normalize();

        // 1) prefix: baseDir에서 "eatda"부터 끝까지 → "eatda/test" 또는 "eatda"
        final String prefix = extractPrefixFromBase(base);

        // 2) tail: baseDir 이후 경로 → "data/images/..."
        final String tail   = extractTailFromAbs(abs, base);

        String urlPath = ("/" + prefix + "/" + tail).replaceAll("/+", "/");
        return trimTrailingSlash(publicBaseUrl) + urlPath;
    }

    private String extractPrefixFromBase(Path base) {
        // base에서 "eatda" 위치를 찾음
        int eatdaIdx = -1;
        for (int i = 0; i < base.getNameCount(); i++) {
            if ("eatda".equalsIgnoreCase(base.getName(i).toString())) {
                eatdaIdx = i;
                break;
            }
        }
        Path prefixPath;
        if (eatdaIdx >= 0) {
            // ex) "eatda/test"
            prefixPath = base.subpath(eatdaIdx, base.getNameCount());
        } else {
            // 못 찾으면 마지막 두 단계로(예: ".../eatda/test"가 아닐 때) 안전 폴백
            int n = base.getNameCount();
            prefixPath = (n >= 2) ? base.subpath(n - 2, n) : base.getFileName();
        }
        return prefixPath.toString().replace("\\", "/");
    }

    private String extractTailFromAbs(Path abs, Path base) {
        try {
            if (abs.startsWith(base)) {
                // 정상 케이스: baseDir 하위
                return base.relativize(abs).toString().replace("\\", "/");
            }
        } catch (IllegalArgumentException ignore) {
            // 드라이브가 다를 때(윈도우 등) 발생 가능 → 아래 폴백으로
        }
        // 폴백1: abs에서 "data" 이후 전부
        int dataIdx = -1;
        for (int i = 0; i < abs.getNameCount(); i++) {
            if ("data".equalsIgnoreCase(abs.getName(i).toString())) {
                dataIdx = i;
                break;
            }
        }
        if (dataIdx >= 0) {
            return abs.subpath(dataIdx, abs.getNameCount()).toString().replace("\\", "/");
        }
        // 폴백2: 파일명만
        return abs.getFileName().toString();
    }

    private String trimTrailingSlash(String s) {
        return (s != null && s.endsWith("/")) ? s.substring(0, s.length() - 1) : s;
    }
}
