package com.elmn.SecurityLastChance.dto.auth;

public record SignupRequest(
        String username,
        String email,
        String password
) {
}
