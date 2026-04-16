package com.elmn.SecurityLastChance.dto.auth;

public record AuthRequest(
        String email,
        String password
) {
}
