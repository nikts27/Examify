package com.example.exams.controller;

import com.example.exams.model.Exam;
import com.example.exams.request.ForgotPasswordTokenRequest;
import com.example.exams.domain.VerificationType;
import com.example.exams.model.ForgotPasswordToken;
import com.example.exams.model.User;
import com.example.exams.request.ResetPasswordRequest;
import com.example.exams.response.ApiResponse;
import com.example.exams.response.AuthResponse;
import com.example.exams.service.EmailService;
import com.example.exams.service.ForgotPasswordService;
import com.example.exams.service.UserService;
import com.example.exams.utils.OtpUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class UserController {

    private final UserService userService;
    private final ForgotPasswordService forgotPasswordService;
    private final EmailService emailService;

    public UserController(UserService userService, ForgotPasswordService forgotPasswordService, EmailService emailService) {
        this.userService = userService;
        this.forgotPasswordService = forgotPasswordService;
        this.emailService = emailService;
    }

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/api/users/exams")
    public ResponseEntity<List<Exam>> getUserExams(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Exam> exams = userService.getUserExams(user);
        return new ResponseEntity<>(exams, HttpStatus.OK);
    }

    @PostMapping("/auth/users/reset-password/sendotp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) throws Exception {

        User user = userService.findUserByUsername(req.getSendTo().split("@")[0]);
        String otp = OtpUtils.generateOtp();
        UUID uuid = UUID.randomUUID();
        String id = uuid.toString();

        ForgotPasswordToken token = forgotPasswordService.findByUser(user.getUsername());

        if(token==null){
            token = forgotPasswordService.createToken(user, id, otp, req.getVerificationType(), req.getSendTo());
        }

        if(req.getVerificationType().equals(VerificationType.EMAIL)){
            String userEmail = user.getUsername() + "@uom.edu.gr";
            emailService.sendVerificationOtpEmail(userEmail, token.getOtp());
        }
        AuthResponse response = new AuthResponse();
        response.setSession(token.getId());
        response.setMessage("Password reset otp sent successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/auth/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String username,
            @RequestBody ResetPasswordRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {
        ForgotPasswordToken forgotPasswordToken  = forgotPasswordService.findByUser(username);

        boolean isVerified = forgotPasswordToken.getOtp().equals(req.getOtp());

        if(isVerified){
            userService.updatePassword(forgotPasswordToken.getUser(),req.getPassword());
            ApiResponse res = new ApiResponse();
            res.setMessage("Password update successfully");
            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }
        throw new Exception("wrong otp");
    }
}
