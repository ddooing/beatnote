package com.note.note.repository;

import com.note.note.Entity.RefreshEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {
    // JWT Refresh 존재 확인 메소드
    Boolean existsByRefresh(String refreshToken);

    // JWT Refresh 토큰 삭제 메소드
    @Transactional
    void deleteByRefresh(String refresh);

    // 특정 유저 Refresh 토큰 모두 삭제 (탈퇴)
    @Transactional
    void deleteByUsername(String username);

    // 특정일 지난 refresh 토큰 삭제
    @Transactional
    void deleteByCreatedDateBefore(LocalDateTime createdDate);
}