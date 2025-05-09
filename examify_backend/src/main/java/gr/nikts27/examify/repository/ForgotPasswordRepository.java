package gr.nikts27.examify.repository;

import gr.nikts27.examify.entity.ForgotPasswordToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ForgotPasswordRepository extends MongoRepository<ForgotPasswordToken, String> {

    ForgotPasswordToken findByUserId(String username);
    ForgotPasswordToken findByUsername(String token);
}
