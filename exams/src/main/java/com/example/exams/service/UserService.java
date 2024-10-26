package com.example.exams.service;

import com.example.exams.model.User;

public interface UserService {

    public User findUserProfileByJwt(String jwt) throws Exception;
    public User findUserByUsername(String username) throws Exception;

    User updatePassword(User user, String newPassword);
}
