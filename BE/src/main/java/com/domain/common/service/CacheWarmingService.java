package com.domain.common.service;

import com.domain.common.entity.Poi;
import com.domain.common.repository.PoiRepository;
import com.global.constants.SearchDistance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheWarmingService {

    private final PoiRepository poiRepository;
    private final SpatialSearchService spatialSearchService;
    private final PoiAccessTrackingService accessTrackingService;

    private static final Set<String> MAJOR_AREAS = Set.of(
            "신논현역", "홍대입구역", "명동역", "종로3가역", "종로5가역", "신촌역"
    );

    /**
     * 출근 시간 전 캐시 예열 (오전 7시)
     */
    @Scheduled(cron = "0 0 7 * * MON-FRI")
    public void warmCacheForMorningRush() {
        log.info("Starting morning rush cache warming");
        warmCacheForAreas(List.of("신논현역", "홍대입구역", "명동역"));
    }

    /**
     * 점심 시간 전 캐시 예열 (오전 11시 30분)
     */
    @Scheduled(cron = "0 30 11 * * MON-FRI")
    public void warmCacheForLunch() {
        log.info("Starting lunch time cache warming");
        warmCacheForAreas(List.of("종로3가역", "종로5가역", "신촌역"));
    }

    /**
     * 저녁 시간 전 캐시 예열 (오후 5시 30분)
     */
    @Scheduled(cron = "0 30 17 * * *")
    public void warmCacheForDinner() {
        log.info("Starting dinner time cache warming");
        warmCacheForAreas(List.of("신논현역", "홍대입구역", "명동역", "종로3가역", "종로5가역", "신촌역"));
    }

    private void warmCacheForAreas(List<String> areas) {
        for (String area : areas) {
            try {
                List<Poi> pois = poiRepository.findByName(area);

                for (Poi poi : pois) {
                    for (SearchDistance distance : SearchDistance.values()) {
                        spatialSearchService.getNearbyStoresWithDistance(poi.getId(), distance.getMeters());
                    }
                }

                log.info("Warmed cache for area: {}", area);
            } catch (Exception e) {
                log.error("Failed to warm cache for area {}: {}", area, e.getMessage());
            }
        }
    }
}
