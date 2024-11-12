package com.example.exams.response;

import lombok.Data;

@Data
public class AuthResponse {

    private String jwtAccess;
    private String jwtRefresh;
    private boolean status;
    private String message;
    private boolean error;
    private String session;

}