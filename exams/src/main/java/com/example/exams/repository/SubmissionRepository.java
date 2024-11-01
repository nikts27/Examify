package com.example.exams.repository;

import com.example.exams.model.Exam;
import com.example.exams.model.Submission;
import com.example.exams.service.SubmissionService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentUsername(String username);
    List<Submission> findByExam(Exam exam);
    Submission findById(long id);
}
