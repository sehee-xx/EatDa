package com.domain.event.service.impl;

import com.domain.event.dto.request.EventAssetCreateRequest;
import com.domain.event.dto.response.EventAssetRequestResponse;
import com.domain.event.entity.Event;
import com.domain.event.mapper.EventMapper;
import com.domain.event.repository.EventRepository;
import com.domain.event.service.EventService;
import com.domain.store.entity.Store;
import com.domain.store.repository.StoreRepository;
import com.global.constants.ErrorCode;
import com.global.exception.ApiException;
import com.global.utils.AssetValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final StoreRepository storeRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public EventAssetRequestResponse requestEventAsset(EventAssetCreateRequest request) {
        // storeId 유효성 검사
        Store store = storeRepository.findById(request.storeId())
                        .orElseThrow(() -> new ApiException(ErrorCode.STORE_NOT_FOUND));

        AssetValidator.validateImages(request.image(), ErrorCode.IMAGE_TOO_LARGE);

        LocalDate startDate = LocalDate.parse(request.startDate());
        LocalDate endDate = LocalDate.parse(request.endDate());

        Event event = createPendingEvent(store, startDate, endDate);

        return null;
    }

    private Event createPendingEvent(final Store store, final LocalDate startDate, final LocalDate endDate) {
        return eventRepository.save(eventMapper.toPendingEvent(store, startDate, endDate));
    }
}
