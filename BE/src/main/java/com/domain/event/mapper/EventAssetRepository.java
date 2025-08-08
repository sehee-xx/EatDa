package com.domain.event.mapper;

import com.domain.event.entity.EventAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventAssetRepository extends JpaRepository<EventAsset, Long> {
}
