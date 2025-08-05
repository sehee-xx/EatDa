package com.domain.user.service.impl;

import com.domain.user.dto.request.EaterSignUpRequest;
import com.domain.user.entity.User;
import com.domain.user.mapper.EaterMapper;
import com.domain.user.repository.EaterRepository;
import com.domain.user.service.EaterService;
import com.global.constants.ErrorCode;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EaterServiceImpl implements EaterService {

    private final EaterRepository eaterRepository;
    private final EaterMapper eaterMapper;

    @Override
    public User registerEater(final EaterSignUpRequest request) {
        if (Objects.isNull(request.email()) || request.email().isBlank()) {
            throw new IllegalArgumentException(ErrorCode.EMAIL_REQUIRED.getMessage());
        }
        if (!request.email().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException(ErrorCode.EMAIL_INVALID_FORMAT.getMessage());
        }
        if (eaterRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(ErrorCode.EMAIL_DUPLICATED.getMessage());
        }
        if (Objects.isNull(request.password()) || request.password().isBlank()) {
            throw new IllegalArgumentException(ErrorCode.PASSWORD_REQUIRED.getMessage());
        }
        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException(ErrorCode.PASSWORD_MISMATCH.getMessage());
        }
        if (request.password().length() < 8) {
            throw new IllegalArgumentException(ErrorCode.PASSWORD_TOO_SHORT.getMessage());
        }
        if (Objects.isNull(request.nickname()) || request.nickname().isBlank()) {
            throw new IllegalArgumentException(ErrorCode.NICKNAME_REQUIRED.getMessage());
        }
        if (eaterRepository.existsByNickname(request.nickname())) {
            throw new IllegalArgumentException(ErrorCode.NICKNAME_DUPLICATED.getMessage());
        }
        return eaterRepository.save(eaterMapper.toEntity(request));
    }
}
