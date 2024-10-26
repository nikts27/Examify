package com.example.exams.service;

import com.example.exams.model.User;
import com.example.exams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PasswordMigrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void migratePasswords() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            String plainPassword = user.getPassword();
            if (plainPassword != null && !plainPassword.startsWith("$2a$") && !plainPassword.startsWith("$2b$")) {
                String hashedPassword = passwordEncoder.encode(plainPassword);
                user.setPassword(hashedPassword);
                userRepository.save(user);
            }
        }
    }
}

