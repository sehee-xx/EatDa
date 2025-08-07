package com.domain.review.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nick_name", nullable = false, length = 50)
    private String nickName;  // nickname 필드 이름 수정 (Java 컨벤션에 맞게)

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewScrap> scraps;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * 이 사용자의 스크랩 목록에 새로운 스크랩을 추가합니다.
     * 양방향 관계를 유지하기 위해 ReviewScrap의 user도 설정합니다.
     *
     * @param scrap 추가할 ReviewScrap 객체
     */
    public void addScrap(ReviewScrap scrap) {
        // null 체크와 중복 방지
        if (scrap != null && !this.scraps.contains(scrap)) {
            this.scraps.add(scrap);
            // 양방향 관계 유지: ReviewScrap의 user 필드도 이 User 인스턴스를 가리키도록 설정
            scrap.setUser(this);
        }
    }

    /**
     * 이 사용자의 스크랩 목록에서 특정 스크랩을 제거합니다.
     * 양방향 관계를 해제하기 위해 ReviewScrap의 user를 null로 설정합니다.
     *
     * @param scrap 제거할 ReviewScrap 객체
     */
    public void removeScrap(ReviewScrap scrap) {
        // null 체크와 존재 여부 확인
        if (scrap != null && this.scraps.contains(scrap)) {
            this.scraps.remove(scrap);
            // 양방향 관계 해제: ReviewScrap의 user 필드를 null로 설정
            // orphanRemoval = true 이므로, 이 작업은 DB에서 해당 ReviewScrap을 삭제하는 트리거가 됩니다.
            scrap.setUser(null);
        }
    }

    /**
     * 이 사용자의 모든 스크랩을 제거합니다.
     * 각각의 removeScrap 메서드를 호출하여 양방향 관계를 올바르게 해제합니다.
     */
    public void clearScraps() {
        new ArrayList<>(this.scraps).forEach(this::removeScrap);
    }
}
