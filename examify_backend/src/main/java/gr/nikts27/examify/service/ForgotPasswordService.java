package gr.nikts27.examify.service;

import gr.nikts27.examify.dto.VerificationType;
import gr.nikts27.examify.entity.ForgotPasswordToken;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.repository.ForgotPasswordRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class ForgotPasswordService {

    private final ForgotPasswordRepository forgotPasswordRepository;

    public ForgotPasswordToken createToken(User user, String id, String otp, VerificationType verificationType, String sendTo) {
        ForgotPasswordToken token = new ForgotPasswordToken();
        token.setUserId(user.getId());
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

//    public ForgotPasswordToken findByUser(String userId) {
//        return forgotPasswordRepository.findByUserId(username);
//    }

    public ForgotPasswordToken findByUserName(String username) {
        return forgotPasswordRepository.findByUsername(username);
    }

    public void deleteToken(ForgotPasswordToken token) {
        forgotPasswordRepository.delete(token);
    }
}