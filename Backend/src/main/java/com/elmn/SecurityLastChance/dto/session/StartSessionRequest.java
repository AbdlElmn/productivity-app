package com.elmn.SecurityLastChance.dto.session;

public record StartSessionRequest(
        Long categoryId,
        String note
) {
}
