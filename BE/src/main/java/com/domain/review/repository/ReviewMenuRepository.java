package com.domain.review.repository;

import com.domain.review.entity.ReviewMenu;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewMenuRepository extends JpaRepository<ReviewMenu, Long> {
    boolean existsByReviewIdAndMenuId(Long reviewId, Long menuId);

    @Query("""
                SELECT rm.menu.id
                FROM ReviewMenu rm
                WHERE rm.review.id = :reviewId AND rm.menu.id IN :menuIds
            """)
    List<Long> findExistingMenuIdsInReview(Long reviewId, List<Long> menuIds);
}
