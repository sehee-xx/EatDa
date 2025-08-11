package com.global.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "filestorage")
@Getter
@Setter
public class FileStorageProperties {

    private static final String DATA_PATH = "data";
    private static final String IMAGES_PATH = "images";
    private static final String VIDEOS_PATH = "videos";

    private String baseDir;         // 예) /home/ubuntu/eatda/test
    private String publicBaseUrl;   // 예) https://i13a609.p.ssafy.io (local에선 비움)

    public String getImageRoot() {
        final String bd = Objects.requireNonNull(baseDir, "filestorage.base-dir is null");
        return Paths.get(bd, DATA_PATH, IMAGES_PATH).toAbsolutePath().normalize().toString();
    }

    public String getVideoRoot() {
        final String bd = Objects.requireNonNull(baseDir, "filestorage.base-dir is null");
        return Paths.get(bd, DATA_PATH, VIDEOS_PATH).toAbsolutePath().normalize().toString();
    }

    /**
     * 저장된 "절대 파일경로"를 응답용 경로/URL로 변환
     * - publicBaseUrl 비어있음(local): 절대경로 그대로 반환
     * - 값 있음(test/prod): https://host + /eatda/test + /data/images/... 로 반환
     */
    public String toResponsePath(final String absolutePath) {
        if (publicBaseUrl == null || publicBaseUrl.isBlank()) {
            return absolutePath; // local
        }
        final String abs = normalizeSlash(Objects.requireNonNull(absolutePath, "absolutePath"));
        final String bd  = normalizeSlash(Objects.requireNonNull(baseDir, "filestorage.base-dir is null"));
        final String home = normalizeSlash(System.getProperty("user.home"));

        // 1) tail: absolute - baseDir (정확히 접두 일치하는지 먼저 확인)
        String tail;
        if (abs.startsWith(addLeadingSlashIfNeeded(bd))) {
            tail = abs.substring(addLeadingSlashIfNeeded(bd).length()); // ex) "/data/images/..."
        } else if (abs.startsWith(bd)) {
            tail = abs.substring(bd.length());                          // ex) "/data/images/..."
        } else {
            // 최후 폴백: "data"부터 자르기
            int idx = abs.indexOf("/data/");
            tail = (idx >= 0) ? abs.substring(idx) : ("/" + Paths.get(abs).getFileName().toString());
        }
        if (!tail.startsWith("/")) tail = "/" + tail;

        // 2) prefix: baseDir - user.home  (항상 /eatda/test 형태 보장)
        String prefix;
        if (bd.startsWith(addLeadingSlashIfNeeded(home))) {
            prefix = bd.substring(addLeadingSlashIfNeeded(home).length()); // ex) "/eatda/test"
        } else if (bd.startsWith(home)) {
            prefix = bd.substring(home.length());
        } else {
            // 폴백: baseDir의 마지막 1~2 세그먼트로 구성 (대부분 "eatda/test")
            Path p = Paths.get(bd);
            Path sfx = (p.getNameCount() >= 2) ? p.subpath(p.getNameCount() - 2, p.getNameCount()) : p.getFileName();
            prefix = "/" + normalizeSlash(sfx.toString());
        }
        if (!prefix.startsWith("/")) prefix = "/" + prefix;

        // 최종 URL
        return trimTrailingSlash(publicBaseUrl) + (prefix + tail).replaceAll("/+", "/");
    }

    // ---------- utils ----------
    private static String normalizeSlash(String s) {
        return s.replace("\\", "/");
    }
    private static String addLeadingSlashIfNeeded(String s) {
        return s.startsWith("/") ? s : "/" + s;
    }
    private static String trimTrailingSlash(String s) {
        return (s != null && s.endsWith("/")) ? s.substring(0, s.length() - 1) : s;
    }
}
