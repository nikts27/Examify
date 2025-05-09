package gr.nikts27.examify.entity;

import gr.nikts27.examify.obj.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
@Document(collection  = "users")
public class User {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String username;
    private String password;
    private Role role;
    private List<String> courses;
    private String refreshToken;
    private LocalDateTime createdAt;
}
