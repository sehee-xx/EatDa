package com.domain.event.mapper;

import com.domain.event.dto.request.EventAssetCreateRequest;
import com.domain.event.dto.response.EventAssetRequestResponse;
import com.domain.event.entity.Event;
import com.domain.event.entity.EventAsset;
import com.domain.store.entity.Store;
import com.global.constants.AssetType;
import com.global.constants.Status;
import org.mapstruct.Mapper;

import java.time.LocalDate;

@Mapper
public interface EventMapper {

    default Event toPendingEvent(final Store store, final LocalDate startDate, final LocalDate endDate) {
        return Event.builder()
                .store(store)
                .startDate(startDate)
                .endDate(endDate)
                .status(Status.PENDING)
                .build();
    }

    default EventAsset toPendingEventAsset(final Event event, final AssetType type, final EventAssetCreateRequest request) {
        return EventAsset.builder()
                .event(event)
                .type(type)
                .prompt(request.prompt())
                .status(Status.PENDING)
                .build();
    }

    default EventAssetRequestResponse toRequestResponse(final EventAsset asset) {
        return new EventAssetRequestResponse(asset.getId());
    }
}
