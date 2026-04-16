package com.elmn.SecurityLastChance.controller;

import com.elmn.SecurityLastChance.dto.auth.AuthRequest;
import com.elmn.SecurityLastChance.dto.auth.AuthResponse;
import com.elmn.SecurityLastChance.dto.auth.AuthUserResponse;
import com.elmn.SecurityLastChance.dto.auth.SignupRequest;
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

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
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
