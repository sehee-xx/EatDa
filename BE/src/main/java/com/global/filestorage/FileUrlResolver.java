package com.global.filestorage;

import com.global.config.FileStorageProperties;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FileUrlResolver {
    private final FileStorageProperties properties;

    @Named("toPublicUrl")
    public String toPublicUrl(String fullPath) {
        if (fullPath == null || fullPath.isBlank()) {
            return fullPath;
        }

        String baseUrl = properties.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            // baseUrl이 없으면 로컬 경로 그대로 반환 (기존 동작 유지)
            return fullPath;
        }

        Path full = Paths.get(fullPath).toAbsolutePath().normalize();

        // hostBaseDir 우선, 그 다음 baseDir 순서로 상대 경로 계산
        Path[] bases = new Path[]{
                properties.getHostBaseDirPath(),
                properties.getBaseDirPath()
        };

        Path relative = null;
        for (Path base : bases) {
            if (base != null) {
                try {
                    Path normBase = base.toAbsolutePath().normalize();
                    if (full.startsWith(normBase)) {
                        relative = normBase.relativize(full);
                        break;
                    }
                } catch (Exception ignore) { /* no-op */ }
            }
        }

        // 어떤 베이스에도 매칭되지 않으면 보수적으로 원본 반환
        if (relative == null) {
            return fullPath;
        }

        String rel = relative.toString().replace("\\", "/");
        return baseUrl.endsWith("/") ? baseUrl + rel : baseUrl + "/" + rel;
    }
}
