package gr.nikts27.examify.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String otp;
    private String password;
}
