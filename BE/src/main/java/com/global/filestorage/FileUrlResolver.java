package com.global.filestorage;

import com.global.config.FileStorageProperties;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FileUrlResolver {
    private final FileStorageProperties properties;

    @Named("toPublicUrl")
    public String toPublicUrl(String fullPath) {
        if (Objects.isNull(fullPath) || fullPath.isBlank()) {
            return fullPath;
        }
        
        Path full = Paths.get(fullPath).toAbsolutePath().normalize();
        Path base = properties.getBaseDirPath();

        Path relative = base.relativize(full);
        String rel = relative.toString().replace("\\", "/");

        String baseUrl = properties.getBaseUrl();

        if (Objects.isNull(baseUrl) || baseUrl.isBlank()) {
            return fullPath;
        }
        return baseUrl.endsWith("/") ? baseUrl + rel : baseUrl + "/" + rel;
    }
}
