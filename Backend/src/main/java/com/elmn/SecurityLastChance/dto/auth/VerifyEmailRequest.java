package com.elmn.SecurityLastChance.dto.auth;

public record VerifyEmailRequest(
        String email,
        String code
) {
}
