package com.domain.review.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "review")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // User 엔티티 참조

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(nullable = false, length = 500)
    private String description;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewScrap> scraps;

//    @ElementCollection
//    @CollectionTable(name = "review_menu", joinColumns = @JoinColumn(name = "review_id"))
//    @Column(name = "menu_name")
//    private List<String> menuNames = new ArrayList<>();
//
//    @Column(name = "asset_url", length = 500)
//    private String assetUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }


    /**
     * 이 리뷰의 스크랩 목록에 새로운 스크랩을 추가합니다.
     * 양방향 관계를 유지하기 위해 ReviewScrap의 review도 설정합니다.
     *
     * @param scrap 추가할 ReviewScrap 객체
     */
    public void addScrap(ReviewScrap scrap) {
        if (scrap != null && !this.scraps.contains(scrap)) {
            this.scraps.add(scrap);
            // 양방향 관계 유지: ReviewScrap의 review 필드도 이 Review 인스턴스를 가리키도록 설정
            scrap.setReview(this);
        }
    }

    /**
     * 이 리뷰의 스크랩 목록에서 특정 스크랩을 제거합니다.
     * 양방향 관계를 해제하기 위해 ReviewScrap의 review를 null로 설정합니다.
     *
     * @param scrap 제거할 ReviewScrap 객체
     */
    public void removeScrap(ReviewScrap scrap) {
        if (scrap != null && this.scraps.contains(scrap)) {
            this.scraps.remove(scrap);
            // 양방향 관계 해제
            scrap.setReview(null);
        }
    }

    /**
     * 이 리뷰의 모든 스크랩을 제거합니다.
     */
    public void clearScraps() {
        new ArrayList<>(this.scraps).forEach(this::removeScrap);
    }
}
