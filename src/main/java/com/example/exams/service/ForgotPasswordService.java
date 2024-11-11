package com.example.exams.service;

import com.example.exams.domain.VerificationType;
import com.example.exams.model.ForgotPasswordToken;
import com.example.exams.model.User;
import com.example.exams.repository.ForgotPasswordRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ForgotPasswordService {

    private final ForgotPasswordRepository forgotPasswordRepository;

    public ForgotPasswordService(ForgotPasswordRepository forgotPasswordRepository) {
        this.forgotPasswordRepository = forgotPasswordRepository;
    }

    public ForgotPasswordToken createToken(User user, String id, String otp, VerificationType verificationType, String sendTo) {
        ForgotPasswordToken token = new ForgotPasswordToken();
        token.setUser(user);
        token.setSendTo(sendTo);
        token.setVerificationType(verificationType);
        token.setOtp(otp);
        token.setId(id);
        return forgotPasswordRepository.save(token);
    }

    public ForgotPasswordToken findById(String id) {
        Optional<ForgotPasswordToken> token = forgotPasswordRepository.findById(id);
        return token.orElse(null);
    }

    public ForgotPasswordToken findByUser(String username) {
        return forgotPasswordRepository.findByUser_username(username);
    }

    public void deleteToken(ForgotPasswordToken token) {
        forgotPasswordRepository.delete(token);
    }
}
