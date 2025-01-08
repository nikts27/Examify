package gr.nikts27.examify.repository;

import gr.nikts27.examify.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @author Cleavest on 3/1/2025
 */
public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String email);
}
