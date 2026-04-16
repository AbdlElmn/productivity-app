package com.elmn.SecurityLastChance.controller;

import com.elmn.SecurityLastChance.dto.auth.AuthRequest;
import com.elmn.SecurityLastChance.dto.auth.AuthResponse;
import com.elmn.SecurityLastChance.dto.auth.RegisterRequest;
import com.elmn.SecurityLastChance.dto.auth.SimpleMessageResponse;
import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.service.AuthService;
import com.elmn.SecurityLastChance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/testing")
    public String test() {
        return "Success";
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/add-user")
    public ResponseEntity<SimpleMessageResponse> registerUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
