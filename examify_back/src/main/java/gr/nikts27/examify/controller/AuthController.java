package gr.nikts27.examify.controller;

import gr.nikts27.examify.config.JwtProvider;
import gr.nikts27.examify.dto.AuthResponse;
import gr.nikts27.examify.dto.RefreshTokenRequest;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.repository.UserRepository;
import gr.nikts27.examify.service.CustomUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        // Authenticate the user
        Authentication auth = authenticate(username, password);

        // Set the authentication context
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Generate JWT token
        String jwtAccess = JwtProvider.generateAccessToken(auth);
        String jwtRefresh = JwtProvider.generateRefreshToken(auth);

        //Save user's refresh token to user repository
        User user = userRepository.findByUsername(username);
        user.setRefreshToken(jwtRefresh);
        userRepository.save(user);

        // Prepare the response
        AuthResponse res = new AuthResponse();
        res.setJwtAccess(jwtAccess);
        res.setJwtRefresh(jwtRefresh);
        res.setStatus(true);
        res.setMessage("Login success");

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        // Validate the refresh token
        if (!JwtProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        // Get username from the refresh token
        String username = JwtProvider.getUsernameFromToken(refreshToken);

        User user = userRepository.findByUsername(username);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            System.out.println("User not found: " + username);
            throw new BadCredentialsException("Invalid username!");
        }

        Authentication auth;
        if (user.getPassword().equals(userDetails.getPassword())) {
            auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        } else {
            throw new BadCredentialsException("Invalid password!");
        }

        String newAccessToken = JwtProvider.generateAccessToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwtAccess(newAccessToken);
        res.setJwtRefresh(refreshToken);
        res.setStatus(true);

        // Return the new access token
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            System.out.println("User not found: " + username);
            throw new BadCredentialsException("Invalid username!");
        }
        if (!isPasswordValid(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password!");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    private boolean isPasswordValid(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}
