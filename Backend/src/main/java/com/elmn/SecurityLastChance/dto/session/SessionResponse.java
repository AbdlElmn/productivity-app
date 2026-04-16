package com.elmn.SecurityLastChance.dto.session;

import java.time.LocalDateTime;

public record SessionResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String note,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer durationSec,
        boolean active
) {
}
