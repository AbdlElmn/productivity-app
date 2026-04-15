package com.elmn.SecurityLastChance.service;


import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.repo.UserRepo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User registerUser(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}

