package gr.nikts27.examify.controller;

import gr.nikts27.examify.dto.*;
import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.entity.ForgotPasswordToken;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.service.EmailService;
import gr.nikts27.examify.service.ForgotPasswordService;
import gr.nikts27.examify.service.UserService;
import gr.nikts27.examify.utils.OtpUtils;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
public class UserController {

    private final UserService userService;
    private final ForgotPasswordService forgotPasswordService;
    private final EmailService emailService;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/api/users/courses")
    public ResponseEntity<List<?>> getUserCourses(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<?> courses = userService.getCoursesForUser(user);

        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/api/users/exams")
    public ResponseEntity<List<?>> getUserExams(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<?> exams = userService.getExamsForUser(user);

        return new ResponseEntity<>(exams, HttpStatus.OK);
    }

    @PostMapping("/auth/users/reset-password/sendotp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) throws Exception {

        User user = userService.findUserByUsername(req.getSendTo().split("@")[0]);
        String otp = OtpUtils.generateOtp();
        UUID uuid = UUID.randomUUID();
        String id = uuid.toString();

        ForgotPasswordToken token = forgotPasswordService.findByUserName(user.getUsername());

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
        ForgotPasswordToken forgotPasswordToken  = forgotPasswordService.findByUserName(username);

        boolean isVerified = forgotPasswordToken.getOtp().equals(req.getOtp());

        if(isVerified){
            userService.updatePassword(forgotPasswordToken.getUserId(),req.getPassword());
            ApiResponse res = new ApiResponse();
            res.setMessage("Password update successfully");
            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }
        throw new Exception("wrong otp");
    }
}
