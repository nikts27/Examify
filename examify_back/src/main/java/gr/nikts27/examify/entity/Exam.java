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
@Document(collection  = "exams")
public class Exam {

    @Id
    private String id;
    private String title;
    private String examId;
    private String courseId;
    private List<String> students;
    private List<MultipleChoiceQuestion> multipleChoiceQuestions;
    private List<TrueOrFalseQuestion> trueOrFalseQuestions;
    private List<TypicalQuestion> typicalQuestions;
    private String startTime;
    private String endTime;
    private String createdAt;

    @Data
    public static class MultipleChoiceQuestion {
        private String questionId;
        private String text;
        private List<String> options;
        private Integer correctOption;
        private int score;
        private int negativeScore;
    }

    @Data
    public static class TrueOrFalseQuestion {
        private String questionId;
        private String text;
        private boolean correctOption;
        private int score;
        private int negativeScore;
    }

    @Data
    public static class TypicalQuestion {
        private String questionId;
        private String text;
        private int score;
    }
}
