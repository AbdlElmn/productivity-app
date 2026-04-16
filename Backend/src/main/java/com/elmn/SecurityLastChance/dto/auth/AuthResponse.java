package com.elmn.SecurityLastChance.dto.auth;

import java.time.Instant;

public record AuthResponse(
        String token,
        Instant expiresAt,
        AuthUserResponse user
) {
}
