package com.domain.review.repository;

import com.domain.review.entity.ReviewAsset;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewAssetRepository extends JpaRepository<ReviewAsset, Long> {
    Optional<ReviewAsset> findById(Long id);
}
