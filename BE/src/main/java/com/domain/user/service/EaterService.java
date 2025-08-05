package com.domain.user.service;

import com.domain.user.dto.request.EaterSignUpRequest;
import com.domain.user.entity.User;

public interface EaterService {
    User register(EaterSignUpRequest request);
}
