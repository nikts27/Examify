package com.example.exams.service;

import com.example.exams.model.*;

import java.util.List;

public interface ExamService {
    Exam findExamById(Long id) throws Exception;
    Exam findByQuestion(long questionId) throws Exception;
    Exam saveExam(Professor professor, Exam exam);
    void deleteExam(Long id);
    Question addQuestion(Long examId, Question question) throws Exception;
    void deleteQuestion(Long id);
}
