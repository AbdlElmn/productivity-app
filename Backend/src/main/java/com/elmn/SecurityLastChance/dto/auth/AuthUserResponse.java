package com.elmn.SecurityLastChance.dto.auth;

public record AuthUserResponse(
        Long id,
        String username,
        String email,
        String role
) {
}
