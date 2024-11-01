package com.example.exams.model;

import com.example.exams.domain.QUESTION_TYPE;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class TypicalQuestion extends Question {
    private String question;
    private boolean graded;

    public TypicalQuestion() {
        this.questionType = QUESTION_TYPE.TYPE_TYPICAL;
    }
}
