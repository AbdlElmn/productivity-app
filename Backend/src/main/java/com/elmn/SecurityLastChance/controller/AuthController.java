package com.elmn.SecurityLastChance.controller;

import com.elmn.SecurityLastChance.dto.auth.AuthRequest;
import com.elmn.SecurityLastChance.dto.auth.AuthResponse;
import com.elmn.SecurityLastChance.dto.auth.AuthUserResponse;
import com.elmn.SecurityLastChance.dto.auth.RegisterRequest;
import com.elmn.SecurityLastChance.dto.auth.ResendCodeRequest;
import com.elmn.SecurityLastChance.dto.auth.SimpleMessageResponse;
import com.elmn.SecurityLastChance.dto.auth.VerifyEmailRequest;
import com.elmn.SecurityLastChance.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<SimpleMessageResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<SimpleMessageResponse> verifyEmail(@RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }

    @PostMapping("/resend-code")
    public ResponseEntity<SimpleMessageResponse> resendCode(@RequestBody ResendCodeRequest request) {
        return ResponseEntity.ok(authService.resendCode(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}
