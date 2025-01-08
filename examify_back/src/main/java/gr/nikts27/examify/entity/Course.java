package gr.nikts27.examify.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
@Document(collection  = "course")
public class Course {

    private String id;
    private String code;
    private String title;
    private List<String> professors;
    private List<String> students;
}
