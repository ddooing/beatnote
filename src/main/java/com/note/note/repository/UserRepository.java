package com.note.note.repository;
import com.note.note.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    //회원가입 - sername 존재여부 확인
    Boolean existsByUsername(String username);

    //회원 정보 수정 - 자체 로그인 여부, 잠김 여부 확인해야함
    Optional<UserEntity> findByUsernameAndIsLockAndIsSocial(String username, Boolean isLock, Boolean isSocial);

    // 유저 제거
    @Transactional
    void deleteByUsername(String username);

    //안잠긴 유저만 정보 조회
    Optional<UserEntity> findByUsernameAndIsLock(String username, Boolean isLock);

    Optional<UserEntity> findByUsernameAndIsSocial(String username, Boolean social);
}