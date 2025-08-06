package com.domain.review.controller;

import com.domain.review.dto.response.ReviewDetailResponse;
import com.domain.review.dto.response.ReviewFeedResponse;
import com.domain.review.dto.response.ReviewFeedResult;
import com.domain.review.service.ReviewService;
import com.global.constants.SuccessCode;
import com.global.dto.response.SuccessResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/feed")
    public ResponseEntity<SuccessResponse<List<ReviewFeedResponse>>> getReviewFeed(
            @RequestParam @NotNull(message = "위도는 필수입니다")
            Double latitude,

            @RequestParam @NotNull(message = "경도는 필수입니다")
            Double longitude,

            @RequestParam(defaultValue = "500")
            Integer distance,

            @RequestParam(required = false)
            Long lastReviewId
    ) {
        log.info("Review feed request - lat: {}, lon: {}, distance: {}m, lastReviewId: {}",
                latitude, longitude, distance, lastReviewId);

        ReviewFeedResult result = reviewService.getReviewFeed(latitude, longitude, distance, lastReviewId);

        if (result.isNearbyReviewsFound()) {
            return ResponseEntity.ok(
                    SuccessResponse.of(
                            SuccessCode.FEED_FETCHED.getCode(),
                            SuccessCode.FEED_FETCHED.getMessage(),
                            HttpStatus.OK.value(),
                            result.getReviews()
                    )
            );
        } else {
            return ResponseEntity.ok(
                    SuccessResponse.of(
                            SuccessCode.FEED_FALLBACK.getCode(),
                            SuccessCode.FEED_FALLBACK.getMessage(),
                            HttpStatus.OK.value(),
                            result.getReviews()
                    )
            );
        }
    }

    /**
     * 리뷰 상세 조회
     * 리뷰 클릭 시 가게 페이지로 이동을 위한 상세 정보 제공
     */
//    @GetMapping("/{reviewId}")
//    public ResponseEntity<SuccessResponse<ReviewDetailResponse>> getReviewDetail(
//            @PathVariable @NotNull Long reviewId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        log.info("Review detail request - reviewId: {}, userId: {}",
//                reviewId, userDetails != null ? userDetails.getUsername() : "anonymous");
//
//        // 로그인한 사용자 ID 추출 (스크랩 여부 확인용)
//        Long userId = null;
//        if (userDetails != null) {
//            userId = Long.parseLong(userDetails.getUsername()); // 또는 적절한 방식으로 추출
//        }
//
//        // 서비스 호출
//        ReviewDetailResponse reviewDetail = reviewService.getReviewDetail(reviewId, userId);
//
//        // 응답 생성
//        return ResponseEntity.ok(
//                SuccessResponse.of(
//                        SuccessCode.REVIEW_DETAIL_FETCHED.getCode(),
//                        SuccessCode.REVIEW_DETAIL_FETCHED.getMessage(),
//                        HttpStatus.OK.value(),
//                        reviewDetail
//                )
//        );
//    }
}
