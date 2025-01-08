package gr.nikts27.examify.dto;

import lombok.Data;

@Data
public class DeleteQuestionRequest {

    private String examId;
    private String questionId;
}
