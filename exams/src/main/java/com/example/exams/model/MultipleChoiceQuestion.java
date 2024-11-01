package com.example.exams.model;

import com.example.exams.domain.QUESTION_TYPE;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class MultipleChoiceQuestion extends Question {

    @ElementCollection
    private List<String> answerChoices;
    private boolean negative;
    private double negativeScore;

    public MultipleChoiceQuestion() {
        this.questionType = QUESTION_TYPE.TYPE_MCQ;
    }
}
