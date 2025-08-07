package com.domain.review.service;

import com.domain.review.dto.response.ReviewDetailResponse;
import com.domain.review.dto.response.ReviewFeedResponse;
import com.domain.review.dto.response.ReviewFeedResult;
import com.domain.review.dto.response.StoreDistanceResult;
import com.domain.review.entity.*;
import com.domain.review.repository.ReviewRepository;
import com.global.constants.ErrorCode;
import com.global.exception.GlobalException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PoiStoreDistanceService poiStoreDistanceService;

    @Transactional(readOnly = true)
    public ReviewFeedResult getReviewFeed(Double latitude, Double longitude, Integer distance, Long lastReviewId) {
        try {
            Poi nearestPoi = poiStoreDistanceService.findNearestPoi(latitude, longitude);
            log.info("nearestPoi: {}", nearestPoi.getName());

            List<StoreDistanceResult> nearbyStores = poiStoreDistanceService.getNearbyStores(
                    nearestPoi.getId(), distance
            );

            if (!nearbyStores.isEmpty()) {
                List<Long> storeIds = nearbyStores.stream()
                        .map(StoreDistanceResult::storeId).toList();

                Pageable limit21 = PageRequest.of(0, 21);
                List<Review> reviews = reviewRepository.findByStoreIdInOrderByIdDesc(
                        storeIds, lastReviewId, limit21
                );

                if (!reviews.isEmpty()) {
                    boolean hasNext = reviews.size() > 20;
                    List<Review> content = hasNext ? reviews.subList(0, 20) : reviews;

                    Map<Long, Integer> storeDistanceMap = nearbyStores.stream()
                            .collect(Collectors.toMap(
                                    StoreDistanceResult::storeId,
                                    StoreDistanceResult::distance
                            ));

                    List<ReviewFeedResponse> feedResponses = content.stream()
                            .map(review -> ReviewFeedResponse.builder()
                                    .reviewId(review.getId())
                                    .storeName(review.getStore().getName())
                                    .description(review.getDescription())
                                    .distance(storeDistanceMap.get(review.getStore().getId()))
                                    .build())
                            .collect(Collectors.toList());

                    return ReviewFeedResult.nearbyReviews(feedResponses, hasNext);
                }
            }

            Pageable limit21 = PageRequest.of(0, 21);
            List<Review> allReviews = reviewRepository.findAllOrderByIdDesc(
                    lastReviewId, limit21
            );
            boolean hasNext = allReviews.size() > 20;
            List<Review> content = hasNext ? allReviews.subList(0, 20) : allReviews;

            List<ReviewFeedResponse> feedResponses = content.stream()
                    .map(review -> ReviewFeedResponse.builder()
                            .reviewId(review.getId())
                            .storeName(review.getStore().getName())
                            .description(review.getDescription())
                            .menuNames(List.of())
//                            .assetUrl(null)
//                            .distance(null) // 전체 피드는 거리 정보 없음
                            .build()).toList();

            return ReviewFeedResult.fallbackReviews(feedResponses, hasNext);
        } catch (NoSuchElementException e) {
            // POI를 찾을 수 없는 경우 전체 피드 제공, 근데 그럴 일 없지 않을까....
            log.warn("No POI found near ({}, {}), returning all reviews", latitude, longitude);
            return getFallbackFeed(lastReviewId);
        }
    }

    @Transactional(readOnly = true)
    public ReviewDetailResponse getReviewDetail(Long reviewId, Long currentUserId) {
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new GlobalException(ErrorCode.BAD_REQUEST));

        Store store = review.getStore();
        if (store == null) {
            throw new GlobalException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        User user = review.getUser();
        if (user == null) {
            throw new GlobalException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        List<ReviewScrap> scraps = review.getScraps();
        int scrapCount = scraps.size();

        boolean isScrapped = currentUserId != null && scraps.stream()
                .anyMatch(scrap -> scrap.getUser().getId().equals(currentUserId));

        // 4. Store 정보 빌드
        ReviewDetailResponse.StoreInfo storeInfo = ReviewDetailResponse.StoreInfo.builder()
                .storeId(store.getId())
                .storeName(store.getName())
                .latitude(store.getLatitude())
                .longitude(store.getLongitude())
                .address(store.getAddress())
                .build();

        // 5. User 정보 빌드
        ReviewDetailResponse.UserInfo userInfo = ReviewDetailResponse.UserInfo.builder()
                .userId(user.getId())
                .nickname(user.getNickName())
                .build();

        return ReviewDetailResponse.builder()
                .reviewId(review.getId())
                .store(storeInfo)
                .user(userInfo)
                .description(review.getDescription())
                .createdAt(review.getCreatedAt())
                .scrapCount(scrapCount)
                .isScrapped(isScrapped)
                // TODO: 아래 필드들은 엔티티에 추가 시 활성화
                // .menuNames(review.getMenuNames())
                // .asset(buildAssetInfo(review))
                // .viewCount(review.getViewCount())
                // .reportCount(review.getReportCount())
                .build();
    }

    private ReviewFeedResult getFallbackFeed(Long lastReviewId) {
        Pageable limit21 = PageRequest.of(0, 21);
        List<Review> allReviews = reviewRepository.findAllOrderByIdDesc(
                lastReviewId, limit21
        );
        boolean hasNext = allReviews.size() > 20;
        List<Review> content = hasNext ? allReviews.subList(0, 20) : allReviews;

        List<ReviewFeedResponse> feedResponses = content.stream()
                .map(review -> ReviewFeedResponse.builder()
                        .reviewId(review.getId())
                        .storeName(review.getStore().getName())
                        .description(review.getDescription())
                        .menuNames(List.of())
//                            .assetUrl(null)
//                            .distance(null) // 전체 피드는 거리 정보 없음
                        .build()).toList();

        return ReviewFeedResult.fallbackReviews(feedResponses, hasNext);
    }
}
