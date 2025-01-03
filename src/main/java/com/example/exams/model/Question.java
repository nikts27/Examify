package com.example.exams.model;

import com.example.exams.domain.QUESTION_TYPE;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Objects;

@Entity
@Data
public abstract class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private long examId;

    @Enumerated(EnumType.STRING)
    protected QUESTION_TYPE questionType;

    private String correctAnswer;

    private double score;
}
