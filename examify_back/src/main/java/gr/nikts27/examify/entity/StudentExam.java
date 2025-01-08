package gr.nikts27.examify.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
@Document(collection  = "studentExams")
public class StudentExam {

    @Id
    private String id;
    private String examId;
    private String studentId;
    private List<Answer> answers;
    private Integer grade;
    private LocalDateTime submittedAt;

    @Data
    public static class Answer {
        private String questionId;
        private String selectedOption;
    }
}
