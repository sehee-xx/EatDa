package com.domain.review.controller;

import com.domain.review.constants.ReviewConstants;
import com.domain.review.dto.response.*;
import com.domain.review.service.ReviewScrapService;
import com.domain.review.service.ReviewService;
import com.domain.review.validation.SeoulLocation;
import com.global.constants.ErrorCode;
import com.global.dto.response.BaseResponse;
import com.global.dto.response.SuccessResponse;
import com.global.exception.ApiException;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewScrapService reviewScrapService;

    /**
     * 위치 기반 리뷰 피드 조회
     *
     * @param latitude 사용자 위도 (필수, 서울 지역 범위)
     * @param longitude 사용자 경도 (필수, 서울 지역 범위)
     * @param distance 조회 반경 (선택, 기본값: 500m, 허용값: 300, 500, 700, 850, 1000, 2000)
     * @param lastReviewId 무한스크롤용 마지막 리뷰 ID (선택)
     * @return 리뷰 피드 목록
     */
    @GetMapping("/feed")
    public ResponseEntity<BaseResponse> getReviewFeed(
            @RequestParam
            @NotNull(message = "위도는 필수입니다")
            @SeoulLocation(type = SeoulLocation.LocationType.LATITUDE, message = "위도는 서울 지역 범위여야 합니다")
            Double latitude,

            @RequestParam
            @NotNull(message = "경도는 필수입니다")
            @SeoulLocation(type = SeoulLocation.LocationType.LONGITUDE, message = "경도는 서울 지역 범위여야 합니다")
            Double longitude,

            @RequestParam(defaultValue = "500")
            Integer distance,

            @RequestParam(required = false)
            Long lastReviewId
    ) {
        log.info("Review feed request - lat: {}, lon: {}, distance: {}m, lastReviewId: {}",
                latitude, longitude, distance, lastReviewId);

        if (!ReviewConstants.SEARCH_DISTANCES.contains(distance)) {
            throw new IllegalArgumentException("거리는 300, 500, 700, 850, 1000, 2000m 중 하나여야 합니다");
        }

        ReviewFeedResult<ReviewFeedResponse> result = reviewService.getReviewFeed(
                latitude, longitude, distance, lastReviewId
        );

        String code = result.nearbyReviewsFound() ? "FEED_FETCHED" : "FEED_FALLBACK";
        String message = result.nearbyReviewsFound()
                ? "리뷰 피드가 성공적으로 조회되었습니다."
                : "주변에 리뷰가 없어 전체 피드를 제공합니다.";

        SuccessResponse<ReviewFeedResult<ReviewFeedResponse>> response =
                SuccessResponse.of(code, message, 200, result);

        return ResponseEntity.ok(response);
    }

    /**
     * 리뷰 상세 정보 조회
     *
     * @param reviewId 조회할 리뷰 ID (필수)
     * @param userId 현재 로그인한 사용자 ID (인증 시 자동 주입, 스크랩 여부 판단용)
     * @return 리뷰 상세 정보
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<BaseResponse> getReviewDetail(
            @PathVariable
            @NotNull(message = "리뷰 ID는 필수입니다")
            @Positive(message = "리뷰 ID는 양수여야 합니다")
            Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false)
            Long userId
//            @AuthenticationPrincipal Long userId  //
    ) {
        log.info("Review detail request - reviewId: {}, userId: {}", reviewId, userId);

        ReviewDetailResponse reviewDetail = reviewService.getReviewDetail(reviewId, userId);

        SuccessResponse<ReviewDetailResponse> response = SuccessResponse.of(
                "REVIEW_DETAIL_FETCHED",
                "리뷰 상세정보를 성공적으로 조회했습니다.",
                200,
                reviewDetail
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 내 리뷰 목록 조회
     */
    @GetMapping("/me")
    public ResponseEntity<BaseResponse> getMyReviews(
            @RequestParam(required = false) Long lastReviewId,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
//            @AuthenticationPrincipal Long userId  // 또는 @CurrentUser Long userId
    ) {
        log.info("My reviews request - userId: {}, lastReviewId: {}, pageSize: {}",
                userId, lastReviewId, pageSize);

        // 인증 체크
        if (userId == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }

        // 서비스 호출
        ReviewFeedResult<MyReviewResponse> result = reviewService.getMyReviews(
                userId, lastReviewId, pageSize
        );

        // 응답 생성
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("reviews", result.reviews());
        responseData.put("hasNext", result.hasNext());

        SuccessResponse<Map<String, Object>> response = SuccessResponse.of(
                "MY_REVIEWS_FETCHED",
                "사용자 리뷰 목록을 성공적으로 조회했습니다.",
                200,
                responseData
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 리뷰 스크랩 토글 (추가/해제)
     *
     * @param reviewId 스크랩할 리뷰 ID (필수)
     * @param userId 현재 로그인한 사용자 ID (필수)
     * @return 스크랩 결과 (스크랩 여부, 현재 스크랩 수)
     */
    @PostMapping("/{reviewId}/scrap/toggle")
    public ResponseEntity<BaseResponse> toggleReviewScrap(
            @PathVariable
            @NotNull(message = "리뷰 ID는 필수입니다")
            @Positive(message = "리뷰 ID는 양수여야 합니다")
            Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
//            @AuthenticationPrincipal Long userId
    ) {
        log.info("Scrap toggle request - reviewId: {}, userId: {}", reviewId, userId);

        // 인증 체크
        if (userId == null) {
            log.warn("Unauthorized scrap toggle attempt for review: {}", reviewId);
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }

        try {
            // 서비스 호출
            ReviewScrapResult result = reviewScrapService.toggleScrap(reviewId, userId);

            // 응답 메시지 분기
            String message = result.isNewScrap()
                    ? "리뷰를 스크랩했습니다."
                    : "리뷰 스크랩을 해제했습니다.";

            // 응답 데이터 구성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("isScrapped", result.isNewScrap());
            responseData.put("scrapCount", result.scrapCount());

            SuccessResponse<Map<String, Object>> response = SuccessResponse.of(
                    "REVIEW_SCRAP_TOGGLED",
                    message,
                    200,
                    responseData
            );

            log.info("Scrap toggle successful - reviewId: {}, userId: {}, isScrapped: {}",
                    reviewId, userId, result.isNewScrap());

            return ResponseEntity.ok(response);

        } catch (ApiException e) {
            // 비즈니스 예외는 그대로 전파
            log.warn("Business exception during scrap toggle - reviewId: {}, error: {}",
                    reviewId, e.getErrorCode());
            throw e;
        } catch (Exception e) {
            // 예상치 못한 예외
            log.error("Unexpected error during scrap toggle - reviewId: {}, userId: {}",
                    reviewId, userId, e);
            throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 리뷰 삭제
     *
     * @param reviewId 삭제할 리뷰 ID (필수)
     * @param userId 현재 로그인한 사용자 ID (필수)
     * @return 삭제 완료 응답
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<BaseResponse> deleteReview(
            @PathVariable
            @NotNull(message = "리뷰 ID는 필수입니다")
            @Positive(message = "리뷰 ID는 양수여야 합니다")
            Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
//            @AuthenticationPrincipal Long userId
    ) {
        log.info("Delete review request - reviewId: {}, userId: {}", reviewId, userId);

        // 인증 체크
        if (userId == null) {
            log.warn("Unauthorized delete attempt for review: {}", reviewId);
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }

        try {
            // 서비스 호출 (작성자 확인 및 삭제 처리)
            reviewService.removeReview(reviewId, userId);

            // 성공 응답
            SuccessResponse<?> response = SuccessResponse.of(
                    "REVIEW_DELETED",
                    "리뷰가 성공적으로 삭제되었습니다.",
                    200
            );

            log.info("Review deleted successfully - reviewId: {}, userId: {}", reviewId, userId);

            return ResponseEntity.ok(response);

        } catch (ApiException e) {
            // 비즈니스 예외는 그대로 전파
            log.warn("Business exception during review deletion - reviewId: {}, error: {}",
                    reviewId, e.getErrorCode());
            throw e;
        } catch (Exception e) {
            // 예상치 못한 예외
            log.error("Unexpected error during review deletion - reviewId: {}, userId: {}",
                    reviewId, userId, e);
            throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
