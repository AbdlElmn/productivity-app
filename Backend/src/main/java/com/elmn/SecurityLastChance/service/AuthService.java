package com.elmn.SecurityLastChance.service;

import com.elmn.SecurityLastChance.dto.auth.AuthRequest;
import com.elmn.SecurityLastChance.dto.auth.AuthResponse;
import com.elmn.SecurityLastChance.dto.auth.AuthUserResponse;
import com.elmn.SecurityLastChance.dto.auth.RegisterRequest;
import com.elmn.SecurityLastChance.dto.auth.ResendCodeRequest;
import com.elmn.SecurityLastChance.dto.auth.SimpleMessageResponse;
import com.elmn.SecurityLastChance.dto.auth.VerifyEmailRequest;
import com.elmn.SecurityLastChance.enums.Role;
import com.elmn.SecurityLastChance.exception.BadRequestException;
import com.elmn.SecurityLastChance.exception.ConflictException;
import com.elmn.SecurityLastChance.exception.ForbiddenException;
import com.elmn.SecurityLastChance.exception.NotFoundException;
import com.elmn.SecurityLastChance.exception.UnauthorizedException;
import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private static final int VERIFICATION_CODE_EXPIRY_MINUTES = 10;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public SimpleMessageResponse register(RegisterRequest request) {
        String username = requireText(request.username(), "Username is required.");
        String email = requireText(request.email(), "Email is required.").toLowerCase();
        String password = requireText(request.password(), "Password is required.");

        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Username is already in use.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already in use.");
        }

        String verificationCode = generateVerificationCode();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES);

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .emailVerified(false)
                .verificationCode(verificationCode)
                .verificationCodeExpiry(expiry)
                .build();

        userRepository.save(user);
        emailService.sendVerificationCode(email, verificationCode);
        return new SimpleMessageResponse("Registration successful. Please verify your email.");
    }

    public AuthResponse login(AuthRequest request) {
        String email = requireText(request.email(), "Email is required.").toLowerCase();
        String password = requireText(request.password(), "Password is required.");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!user.isEmailVerified()) {
            throw new ForbiddenException("Email is not verified.");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password.");
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Authentication failed.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, jwtService.getExpirationInstant(), toUserResponse(user));
    }

    @Transactional
    public SimpleMessageResponse verifyEmail(VerifyEmailRequest request) {
        String email = requireText(request.email(), "Email is required.").toLowerCase();
        String code = normalizeCode(request.code());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found."));

        if (user.isEmailVerified()) {
            return new SimpleMessageResponse("Email is already verified.");
        }

        if (isBlank(user.getVerificationCode()) || user.getVerificationCodeExpiry() == null) {
            throw new BadRequestException("Verification code is missing. Please request a new code.");
        }

        if (!user.getVerificationCode().equals(code)) {
            throw new BadRequestException("Invalid verification code.");
        }

        if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired.");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

        return new SimpleMessageResponse("Email verified successfully.");
    }

    @Transactional
    public SimpleMessageResponse resendCode(ResendCodeRequest request) {
        String email = requireText(request.email(), "Email is required.").toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found."));

        if (user.isEmailVerified()) {
            return new SimpleMessageResponse("Email is already verified.");
        }

        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES));
        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), verificationCode);
        return new SimpleMessageResponse("A new verification code has been sent.");
    }

    public AuthUserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Authenticated user not found.");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found: " + email));

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
            throw new BadRequestException(message);
        }

        return value.trim();
    }

    private String normalizeCode(String code) {
        String normalizedCode = requireText(code, "Verification code is required.");
        if (!normalizedCode.matches("\\d{6}")) {
            throw new BadRequestException("Verification code must be 6 digits.");
        }
        return normalizedCode;
    }

    private String generateVerificationCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
