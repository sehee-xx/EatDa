package com.domain.review.controller;

import com.domain.review.dto.response.StoreDistanceResult;
import com.domain.review.entity.Poi;
import com.domain.review.entity.Store;
import com.domain.review.repository.PoiRepository;
import com.domain.review.repository.StoreRepository;
import com.domain.review.service.PoiStoreDistanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test/poi-distance")
@RequiredArgsConstructor
@Slf4j
@Profile("local")
public class PoiDistanceTestController {

    private final PoiStoreDistanceService poiStoreDistanceService;
    private final PoiRepository poiRepository;
    private final StoreRepository storeRepository;

    /**
     * 1. 특정 좌표에서 가장 가까운 POI 찾기
     */
    @GetMapping("/nearest-poi")
    public ResponseEntity<?> findNearestPoi(
            @RequestParam double lat,
            @RequestParam double lon) {

        log.info("=== Finding nearest POI from ({}, {}) ===", lat, lon);

        try {
            long startTime = System.currentTimeMillis();
            Poi nearestPoi = poiStoreDistanceService.findNearestPoi(lat, lon);
            long executionTime = System.currentTimeMillis() - startTime;

            Map<String, Object> response = Map.of(
                    "userLocation", Map.of("lat", lat, "lon", lon),
                    "nearestPoi", Map.of(
                            "id", nearestPoi.getId(),
                            "name", nearestPoi.getName(),
                            "category", nearestPoi.getCategory(),
                            "location", Map.of(
                                    "lat", nearestPoi.getLatitude(),
                                    "lon", nearestPoi.getLongitude()
                            )
                    ),
                    "executionTimeMs", executionTime
            );

            log.info("Found POI: {} in {}ms", nearestPoi.getName(), executionTime);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error finding nearest POI", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 2. POI 기준으로 거리별 Store 조회
     */
    @GetMapping("/nearby-stores/{poiId}")
    public ResponseEntity<?> getNearbyStores(
            @PathVariable Long poiId,
            @RequestParam int distance) {

        log.info("=== Getting stores near POI {} within {}m ===", poiId, distance);

        try {
            // POI 정보 가져오기
            Poi poi = poiRepository.findById(poiId)
                    .orElseThrow(() -> new IllegalArgumentException("POI not found: " + poiId));

            long startTime = System.currentTimeMillis();
            List<StoreDistanceResult> stores = poiStoreDistanceService.getNearbyStores(poiId, distance);
            long executionTime = System.currentTimeMillis() - startTime;

            // Store 상세 정보 조회
            List<Map<String, Object>> storeDetails = stores.stream()
                    .map(result -> {
                        Store store = storeRepository.findById(result.storeId()).orElse(null);
                        if (store != null) {
                            return Map.of(
                                    "id", store.getId(),
                                    "name", store.getName(),
                                    "distance", result.distance(),
                                    "location", Map.of(
                                            "lat", store.getLatitude(),
                                            "lon", store.getLongitude()
                                    )
                            );
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .toList();

            Map<String, Object> response = Map.of(
                    "poi", Map.of(
                            "id", poi.getId(),
                            "name", poi.getName(),
                            "location", Map.of(
                                    "lat", poi.getLatitude(),
                                    "lon", poi.getLongitude()
                            )
                    ),
                    "requestedDistance", distance,
                    "storeCount", stores.size(),
                    "stores", storeDetails,
                    "executionTimeMs", executionTime
            );

            log.info("Found {} stores in {}ms", stores.size(), executionTime);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting nearby stores", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 3. 전체 플로우 테스트
     */
    @GetMapping("/full-flow")
    public ResponseEntity<?> testFullFlow(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "500") int distance) {

        log.info("=== Testing full flow from ({}, {}) with distance {}m ===", lat, lon, distance);

        try {
            Map<String, Object> response = new HashMap<>();

            // Step 1: Find nearest POI
            long step1Start = System.currentTimeMillis();
            Poi nearestPoi = poiStoreDistanceService.findNearestPoi(lat, lon);
            long step1Time = System.currentTimeMillis() - step1Start;

            response.put("step1_findNearestPoi", Map.of(
                    "poi", Map.of(
                            "id", nearestPoi.getId(),
                            "name", nearestPoi.getName()
                    ),
                    "timeMs", step1Time
            ));

            // Step 2: Get nearby stores
            long step2Start = System.currentTimeMillis();
            List<StoreDistanceResult> stores = poiStoreDistanceService.getNearbyStores(nearestPoi.getId(), distance);
            long step2Time = System.currentTimeMillis() - step2Start;

            response.put("step2_getNearbyStores", Map.of(
                    "storeCount", stores.size(),
                    "requestedDistance", distance,
                    "timeMs", step2Time
            ));

            response.put("totalTimeMs", step1Time + step2Time);

            log.info("Full flow completed in {}ms", step1Time + step2Time);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in full flow test", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 4. 캐시 성능 비교
     */
    @GetMapping("/cache-performance/{poiId}")
    public ResponseEntity<?> testCachePerformance(
            @PathVariable Long poiId,
            @RequestParam(defaultValue = "500") int distance) {

        log.info("=== Testing cache performance for POI {} ===", poiId);

        try {
            // 첫 번째 호출 (캐시 미스 예상)
            long firstCallStart = System.currentTimeMillis();
            List<StoreDistanceResult> firstResult = poiStoreDistanceService.getNearbyStores(poiId, distance);
            long firstCallTime = System.currentTimeMillis() - firstCallStart;

            // 잠시 대기
            Thread.sleep(100);

            // 두 번째 호출 (캐시 히트 예상)
            long secondCallStart = System.currentTimeMillis();
            List<StoreDistanceResult> secondResult = poiStoreDistanceService.getNearbyStores(poiId, distance);
            long secondCallTime = System.currentTimeMillis() - secondCallStart;

            double speedup = (double) firstCallTime / secondCallTime;

            Map<String, Object> response = Map.of(
                    "poiId", poiId,
                    "distance", distance,
                    "firstCall", Map.of(
                            "timeMs", firstCallTime,
                            "storeCount", firstResult.size(),
                            "type", "LIKELY_CACHE_MISS"
                    ),
                    "secondCall", Map.of(
                            "timeMs", secondCallTime,
                            "storeCount", secondResult.size(),
                            "type", "LIKELY_CACHE_HIT"
                    ),
                    "performance", Map.of(
                            "speedup", String.format("%.2fx", speedup),
                            "cacheEffective", speedup > 2.0
                    )
            );

            log.info("Cache performance: {}x speedup", String.format("%.2f", speedup));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error testing cache performance", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 5. DB 데이터 확인
     */
    @GetMapping("/data-check")
    public ResponseEntity<?> checkData() {
        long poiCount = poiRepository.count();
        long storeCount = storeRepository.count();

        // 샘플 데이터
        List<Poi> samplePois = poiRepository.findAll().stream().limit(500).toList();
        List<Store> sampleStores = storeRepository.findAll().stream().limit(5).toList();

        Map<String, Object> response = Map.of(
                "poiCount", poiCount,
                "storeCount", storeCount,
                "samplePois", samplePois.stream().map(p -> Map.of(
                        "id", p.getId(),
                        "name", p.getName(),
                        "category", p.getCategory()
                )).toList(),
                "sampleStores", sampleStores.stream().map(s -> Map.of(
                        "id", s.getId(),
                        "name", s.getName()
                )).toList()
        );

        return ResponseEntity.ok(response);
    }
}