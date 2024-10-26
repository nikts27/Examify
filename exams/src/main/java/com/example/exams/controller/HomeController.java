package com.example.exams.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public String home(){
        return "Welcome to Examify: A university online exam portal!";
    }

    @GetMapping("/api")
    public String secure(){
        return "Welcome to Examify secure";
    }
}
