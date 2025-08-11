package com.domain.menu.service;

import com.domain.menu.dto.request.MenuPosterAssetCreateRequest;
import com.domain.menu.dto.response.MenuPosterAssetRequestResponse;

public interface MenuPosterService {

    MenuPosterAssetRequestResponse requestMenuPosterAsset(final MenuPosterAssetCreateRequest request, final String eaterMail);
}
