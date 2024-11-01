package com.example.exams.service;

import com.example.exams.model.Exam;
import com.example.exams.model.Submission;

import java.util.List;
import java.util.Map;

public interface SubmissionService {
    Submission findSubmissionById(long id) throws Exception;
    List<Submission> getSubmissionsForStudent(String username);
    List<Submission> getSubmissionsForExam(Exam exam);
    Submission submitExam(Submission submission);
    Submission gradeExam(Submission submission, Map<Integer, Double> typicalQuestionScores) throws Exception;
}
