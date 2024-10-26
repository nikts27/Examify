package com.example.exams.service;

import com.example.exams.configg.JwtProvider;
import com.example.exams.model.User;
import com.example.exams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        String username = JwtProvider.getUsernameFromToken(jwt);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    @Override
    public User findUserByUsername(String username) throws Exception {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    @Override
    public User updatePassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }
}
