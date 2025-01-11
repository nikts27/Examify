package gr.nikts27.examify.repository;

import gr.nikts27.examify.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String email);
}
