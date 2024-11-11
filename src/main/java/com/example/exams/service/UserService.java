package com.example.exams.service;

import com.example.exams.configg.JwtProvider;
import com.example.exams.model.Exam;
import com.example.exams.model.Professor;
import com.example.exams.model.Student;
import com.example.exams.model.User;
import com.example.exams.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User findUserProfileByJwt(String jwt) throws Exception {
        String username = JwtProvider.getUsernameFromToken(jwt);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    public User findUserByUsername(String username) throws Exception {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    public List<Exam> getUserExams(User user) {
        return switch (user) {
            case null -> throw new RuntimeException("User not found");
            case Professor professor -> professor.getExamsCreated();
            case Student student -> student.getExamsEnrolled();
            default -> throw new RuntimeException("Unknown user role");
        };
    }

    public User updatePassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }
}
