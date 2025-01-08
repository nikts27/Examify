package gr.nikts27.examify.repository;

import gr.nikts27.examify.entity.ForgotPasswordToken;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @author Cleavest on 3/1/2025
 */
public interface ForgotPasswordRepository extends MongoRepository<ForgotPasswordToken, String> {

    ForgotPasswordToken findByUserId(String username);
    ForgotPasswordToken findByUsername(String token);
}
