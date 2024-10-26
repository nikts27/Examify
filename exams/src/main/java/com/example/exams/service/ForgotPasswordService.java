package com.example.exams.service;

import com.example.exams.domain.VerificationType;
import com.example.exams.model.ForgotPasswordToken;
import com.example.exams.model.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user,
                                    String id, String otp,
                                    VerificationType verificationType,
                                    String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(String username);

    void deleteToken(ForgotPasswordToken token);
}
