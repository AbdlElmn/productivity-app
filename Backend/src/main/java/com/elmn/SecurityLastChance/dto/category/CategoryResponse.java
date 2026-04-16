package com.elmn.SecurityLastChance.dto.category;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String name,
        String color,
        LocalDateTime createdAt
) {
}
