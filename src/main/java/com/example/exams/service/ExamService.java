package com.example.exams.service;

import com.example.exams.model.*;
import com.example.exams.repository.ExamRepository;
import com.example.exams.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public ExamService(ExamRepository examRepository, QuestionRepository questionRepository) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam findExamById(Long id) throws Exception {
        Exam exam = examRepository.findByExamID(id);
        if (exam == null) {
            throw new Exception("Exam not found!");
        }
        return exam;
    }

    public Exam findByQuestion(long questionId) throws Exception {
        Question question = questionRepository.findById(questionId);
        if (question == null) {
            throw new Exception("Question not found!");
        }
        return question.getExamId();
    }

    public Exam saveExam(Professor professor, Exam exam) {
        if (!exam.getProfessors().contains(professor)) {
            exam.addProfessor(professor);
        }
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    public Question addQuestion(Long examId, Question question) throws Exception {
        Exam exam = findExamById(examId);
        if(exam == null) {
            throw new RuntimeException("Exam not found");
        }

        question.setExam(exam);
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
