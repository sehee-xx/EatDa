package com.domain.event.service;

import com.domain.event.dto.request.EventAssetCreateRequest;
import com.domain.event.dto.response.EventAssetRequestResponse;
import com.global.dto.request.AssetCallbackRequest;

public interface EventService {

    EventAssetRequestResponse requestEventAsset(final EventAssetCreateRequest request, final Long userId);
    void handleEventAssetCallback(final AssetCallbackRequest<?> request);
}
