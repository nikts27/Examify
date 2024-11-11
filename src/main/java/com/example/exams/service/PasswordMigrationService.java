package com.example.exams.service;

import com.example.exams.model.User;
import com.example.exams.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PasswordMigrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigrationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

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

