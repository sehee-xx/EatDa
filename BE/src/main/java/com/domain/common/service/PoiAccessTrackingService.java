package com.domain.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PoiAccessTrackingService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String ACCESS_COUNT_KEY = "poi:access:count:";
    private static final String HOTSPOT_STATUS_KEY = "poi:hotspot:";
    private static final String LAST_ACCESS_KEY = "poi:last_access:";

    // 핫스팟 판정 기준
    private static final int HOTSPOT_THRESHOLD_PER_HOUR = 100;
    private static final Duration ACCESS_COUNT_TTL = Duration.ofHours(1);
    private static final Duration HOTSPOT_STATUS_TTL = Duration.ofHours(24);

    public void recordAccess(Long poiId) {
        try {
            String countKey = ACCESS_COUNT_KEY + poiId;
            String lastAccessKey = LAST_ACCESS_KEY + poiId;

            // 이건 레디스에 반영안되겠지? 그냥 count만 증가일려나
            Long count = redisTemplate.opsForValue().increment(countKey);

            if (count == 1) {
                redisTemplate.expire(countKey, ACCESS_COUNT_TTL);
            }

            // 이건 뭐지?
            redisTemplate.opsForValue().set(lastAccessKey, LocalDateTime.now().toLocalDate(), Duration.ofDays(7));

            if (count >= HOTSPOT_THRESHOLD_PER_HOUR) {
                promoteToHotspot(poiId);
            }

            log.debug("Recorded access for POI {}, count: {}", poiId, count);
        } catch (Exception e) {
            log.error("Error recording access for POI {}", poiId, e);
        }
    }

    /**
     * POI가 핫스팟인지 확인
     */
    public boolean isHotspot(Long poiId) {
        String hotspotKey = HOTSPOT_STATUS_KEY + poiId;
        String value = (String) redisTemplate.opsForValue().get(hotspotKey);
        return "true".equals(value);
    }

    /**
     * 현재 접근 횟수 조회
     */
    public int getCurrentAccessCount(Long poiId) {
        String countKey = ACCESS_COUNT_KEY + poiId;
        Integer count = (Integer) redisTemplate.opsForValue().get(countKey);
        return count != null ? count : 0;
    }

    /**
     * 마지막 접근 시간 조회
     */
    public LocalDateTime getLastAccessTime(Long poiId) {
        String lastAccessKey = LAST_ACCESS_KEY + poiId;
        String timeStr = (String) redisTemplate.opsForValue().get(lastAccessKey);
        return timeStr != null ? LocalDateTime.parse(timeStr) : null;
    }

    private void promoteToHotspot(Long poiId) {
        String hotspotKey = HOTSPOT_STATUS_KEY + poiId;
        redisTemplate.opsForValue().set(hotspotKey, "true", HOTSPOT_STATUS_TTL);
        log.info("POI {} promoted to hotspot", poiId);
    }
}
