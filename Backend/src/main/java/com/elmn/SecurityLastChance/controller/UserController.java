package com.elmn.SecurityLastChance.controller;


import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.service.JwtService;
import com.elmn.SecurityLastChance.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @GetMapping("/testing")
    public String test() {
        return "Success";
    }
    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping("/add-user")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){
        try{

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            return jwtService.generateToken(user.getEmail());


        } catch (Exception e) {
            return e.getMessage();
        }

    }


}
