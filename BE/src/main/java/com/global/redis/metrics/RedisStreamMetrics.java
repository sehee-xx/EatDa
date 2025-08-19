package com.global.redis.metrics;

import io.micrometer.core.instrument.Metrics;
import io.micrometer.core.instrument.Tags;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * Redis Stream backlog 모니터링
 */
@Component
@RequiredArgsConstructor
public class RedisStreamMetrics {

    private final RedisTemplate<String, String> redisStreamTemplate;

    @Scheduled(fixedRate = 5000) // 5초마다 수집
    public void collectMetrics() {
        Long size = redisStreamTemplate.opsForStream().size("review.asset.generate");
        if (size != null) {
            Metrics.gauge("redis_stream_length", Tags.of("stream", "review.asset.generate"), size);
        }
    }
}
