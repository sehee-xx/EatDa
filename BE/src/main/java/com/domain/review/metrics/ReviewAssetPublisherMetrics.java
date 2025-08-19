package com.domain.review.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

/**
 * 리뷰 에셋 Redis 발행 지표
 */
@Component
public class ReviewAssetPublisherMetrics {

    private final Counter publishSuccess;
    private final Counter publishFailure;

    public ReviewAssetPublisherMetrics(MeterRegistry registry) {
        this.publishSuccess = Counter.builder("review_asset_publish_success_total")
                .description("리뷰 에셋 Redis 발행 성공 건수")
                .register(registry);
        this.publishFailure = Counter.builder("review_asset_publish_failure_total")
                .description("리뷰 에셋 Redis 발행 실패 건수")
                .register(registry);
    }

    public void incrementSuccess() {
        publishSuccess.increment();
    }

    public void incrementFailure() {
        publishFailure.increment();
    }
}
