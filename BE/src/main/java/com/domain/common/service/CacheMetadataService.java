package com.domain.common.service;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheMetadataService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String METADATA_KEY_PREFIX = "poi:cache:metadata:";
    private static final Duration METADATA_TTL = Duration.ofDays(7);

    @Builder
    public record CacheMetadata(
            LocalDateTime lastUpdated,
            boolean isStale,
            String staleReason,
            LocalDateTime scheduledRefresh,
            int version
    ) {
        public static CacheMetadata fresh() {
            return CacheMetadata.builder()
                    .lastUpdated(LocalDateTime.now())
                    .isStale(false)
                    .version(1)
                    .build();
        }

        public static CacheMetadata stale(String reason) {
            return CacheMetadata.builder()
                    .lastUpdated(LocalDateTime.now())
                    .isStale(true)
                    .staleReason(reason)
                    .scheduledRefresh(LocalDateTime.now().plusMinutes(5))
                    .version(1)
                    .build();
        }
    }

    public void saveMetadata(Long poiId, int distance, CacheMetadata metadata) {
        String key = generateKey(poiId, distance);
        Map<String, Object> map = convertToMap(metadata);
        redisTemplate.opsForHash().putAll(key, map);
        redisTemplate.expire(key, METADATA_TTL);

        log.debug("Saved cache metadata for POI {} at {}m", poiId, distance);
    }

    public CacheMetadata getMetadata(Long poiId, int distance) {
        String key = generateKey(poiId, distance);
        Map<Object, Object> map = redisTemplate.opsForHash().entries(key);

        if (map.isEmpty()) return null;

        return convertToMetadata(map);
    }

    public void markAsStale(Long poiId, int distance, String reason) {
        CacheMetadata metadata = getMetadata(poiId, distance);
        if (metadata == null) return;

        CacheMetadata staleMetadata = CacheMetadata.builder()
                .lastUpdated(metadata.lastUpdated())
                .isStale(true)
                .staleReason(reason)
                .scheduledRefresh(LocalDateTime.now().plusMinutes(5))
                .version(metadata.version())
                .build();

        saveMetadata(poiId, distance, staleMetadata);
        log.info("Marked cache as stale for POI {} at {}m: {}", poiId, distance, reason);
    }

    public boolean isStale(Long poiId, int distance) {
        CacheMetadata metadata = getMetadata(poiId, distance);
        return metadata != null && metadata.isStale();
    }

    /**
     * 캐시가 너무 오래되었는지 확인 (10분 이상)
     */
    public boolean isTooStale(Long poiId, int distance) {
        CacheMetadata metadata = getMetadata(poiId, distance);
        if (metadata == null || !metadata.isStale()) {
            return false;
        }

        Duration staleDuration = Duration.between(metadata.lastUpdated(), LocalDateTime.now());
        return staleDuration.toMinutes() > 60;
    }

    private String generateKey(Long poiId, int distance) {
        return METADATA_KEY_PREFIX + poiId + ":" + distance;
    }

    private Map<String, Object> convertToMap(CacheMetadata metadata) {
        Map<String, Object> map = new HashMap<>();
        map.put("lastUpdated", metadata.lastUpdated().toString());
        map.put("isStale", String.valueOf(metadata.isStale()));
        map.put("staleReason", metadata.staleReason() != null ? metadata.staleReason() : "");
        map.put("scheduledRefresh", metadata.scheduledRefresh() != null ?
                metadata.scheduledRefresh().toString() : "");
        map.put("version", String.valueOf(metadata.version()));
        return map;
    }

    private CacheMetadata convertToMetadata(Map<Object, Object> map) {
        return CacheMetadata.builder()
                .lastUpdated(LocalDateTime.parse((String) map.get("lastUpdated")))
                .isStale(Boolean.parseBoolean((String) map.get("isStale")))
                .staleReason(!"".equals(map.get("staleReason")) ? (String) map.get("staleReason") : null)
                .scheduledRefresh(!"".equals(map.get("scheduledRefresh")) ?
                        LocalDateTime.parse((String) map.get("scheduledRefresh")) : null)
                .version(Integer.parseInt((String) map.get("version")))
                .build();
    }
}
