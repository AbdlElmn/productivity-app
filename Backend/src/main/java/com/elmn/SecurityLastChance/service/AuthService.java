package com.elmn.SecurityLastChance.service;

import com.elmn.SecurityLastChance.dto.auth.AuthRequest;
import com.elmn.SecurityLastChance.dto.auth.AuthResponse;
import com.elmn.SecurityLastChance.dto.auth.AuthUserResponse;
import com.elmn.SecurityLastChance.dto.auth.SignupRequest;
import com.elmn.SecurityLastChance.enums.Role;
import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String username = requireText(request.username(), "Username is required.");
        String email = requireText(request.email(), "Email is required.").toLowerCase();
        String password = requireText(request.password(), "Password is required.");

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already in use.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use.");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, jwtService.getExpirationInstant(), toUserResponse(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        String email = requireText(request.email(), "Email is required.").toLowerCase();
        String password = requireText(request.password(), "Password is required.");

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, jwtService.getExpirationInstant(), toUserResponse(user));
    }

    public AuthUserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Authenticated user not found.");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + email));

        return toUserResponse(user);
    }

    private AuthUserResponse toUserResponse(User user) {
        return new AuthUserResponse(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException(message);
        }

        return value.trim();
    }
}
