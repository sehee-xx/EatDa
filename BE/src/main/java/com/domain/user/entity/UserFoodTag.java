package com.domain.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_food_tag")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserFoodTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * User 연관관계 (ManyToOne 단방향)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * FoodTag 연관관계 (ManyToOne 단방향)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_tag_id", nullable = false)
    private FoodTag foodTag;
}
