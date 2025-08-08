package com.domain.event.entity;

import com.global.constants.AssetType;
import com.global.constants.Status;
import com.global.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EventAsset extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    private AssetType type;

    private String assetUrl;

    @NotBlank
    private String prompt;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Builder
    public EventAsset(final Event event, final AssetType type, final String assetUrl, final String prompt, final Status status) {
        this.event = event;
        this.type = type;
        this.assetUrl = assetUrl;
        this.prompt = prompt;
        this.status = status != null ? status : Status.PENDING;
    }
}
