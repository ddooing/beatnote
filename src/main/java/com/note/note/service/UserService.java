package com.note.note.service;

import com.note.note.Entity.UserEntity;
import com.note.note.Entity.UserRoleType;
import com.note.note.dto.UserRequestDTO;
import com.note.note.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }


    // 자체 로그인 회원 가입 (존재 여부)
    @Transactional(readOnly =true)
    public Boolean existUser(UserRequestDTO dto) {
        return userRepository.existsByUsername(dto.getUsername());
    }

    // 자체 로그인 회원 가입
    @Transactional
    public Long addUser(UserRequestDTO dto) {

        // 왜 존재 여부를 확인햇음에도 하는 이유는 프론트에서 했다해도 다른 방법으로 백엔드에 직접 쏠 수 있기에 확인을 해야하ㅣㅁ
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("이미 유저가 존재합니다.");
        }

        UserEntity entity = UserEntity.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .isLock(false)
                .isSocial(false)
                .roleType(UserRoleType.USER) // 우선 일반 유저로 가입
                .nickname(dto.getNickname())
                .email(dto.getEmail())
                .build();

        return userRepository.save(entity).getId();
    }

    // 자체 로그인
    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserEntity entity = userRepository.findByUsernameAndIsLockAndIsSocial(username, false, false)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return User.builder()
                .username(entity.getUsername())
                .password(entity.getPassword())
                .roles(entity.getRoleType().name())
                .accountLocked(entity.getIsLock())
                .build();
    }


    // 자체 로그인 회원 정보 수정
    @Transactional
    public Long updateUser(UserRequestDTO dto) throws AccessDeniedException {

        // 본인만 수정 가능 검증
        String sessionUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!sessionUsername.equals(dto.getUsername())) {
            throw new AccessDeniedException("본인 계정만 수정 가능");
        }

        // 자체 로그인 여부, 잠김 여부를 위해 조회
        UserEntity entity = userRepository.findByUsernameAndIsLockAndIsSocial(dto.getUsername(), false, false)
                .orElseThrow(() -> new UsernameNotFoundException(dto.getUsername()));

        // 회원 정보 수정
            //
        entity.updateUser(dto.getEmail(), dto.getNickname());

        return userRepository.save(entity).getId();
    }

    // 자체/소셜 로그인 회원 탈퇴

    // 소셜 로그인 (매 로그인시 : 신규 = 가입, 기존 = 업데이트)

    // 자체/소셜 유저 정보 조회
}
