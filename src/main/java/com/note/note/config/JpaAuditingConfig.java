package com.note.note.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    // Entity의 CreatedDate, LastModifiedDate를 위한 Config를 등록해야  함
}