package com.domain.user.repository;

import com.domain.user.entity.User;
import java.util.Optional;

public interface UserRepository {

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<User> findByEmailAndDeletedFalse(String email);

    Optional<User> findByNicknameAndDeletedFalse(String nickname);

}
