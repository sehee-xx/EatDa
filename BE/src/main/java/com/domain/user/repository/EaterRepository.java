package com.domain.user.repository;

import com.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EaterRepository extends JpaRepository<User, Long>, UserRepository {
}
