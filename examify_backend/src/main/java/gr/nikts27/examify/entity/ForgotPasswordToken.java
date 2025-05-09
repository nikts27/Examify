package gr.nikts27.examify.entity;

import gr.nikts27.examify.dto.VerificationType;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Data
@Document(collection  = "forgot")
public class ForgotPasswordToken {

    @Id
    private String id;

    private String userId;
    private String username;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;

    public ForgotPasswordToken() {
        this.id = UUID.randomUUID().toString();
    }
}
