package com.elmn.SecurityLastChance.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/home")
    public String home(HttpServletRequest req){
        return "Hello, " + "Session id: " + req.getSession().getId();
    }

    @GetMapping("/test")
    public String test(HttpServletRequest req) {
        return "NEW TEXT" + "Session id: " + req.getSession().getId();
    }
}
