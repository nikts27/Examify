package com.example.exams.repository;

import com.example.exams.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    Question findById(long questionId);
}
