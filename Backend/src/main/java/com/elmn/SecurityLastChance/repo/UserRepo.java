package com.elmn.SecurityLastChance.repo;

import com.elmn.SecurityLastChance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


//Repo is always an interface
@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

}