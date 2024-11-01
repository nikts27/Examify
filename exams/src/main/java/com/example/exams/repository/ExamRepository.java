package com.example.exams.repository;

import com.example.exams.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    Exam findByExamID(long id);
}
