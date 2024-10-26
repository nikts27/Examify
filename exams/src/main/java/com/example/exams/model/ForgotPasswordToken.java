package com.example.exams.model;

import com.example.exams.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class ForgotPasswordToken {

    @Id
    private String id;

    @OneToOne
    private User user;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;

    public ForgotPasswordToken() {
        this.id = UUID.randomUUID().toString();
    }
}
