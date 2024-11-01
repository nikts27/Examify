package com.example.exams.service;

import com.example.exams.model.*;
import com.example.exams.repository.ExamRepository;
import com.example.exams.repository.QuestionRepository;
import com.example.exams.repository.SubmissionRepository;
import com.example.exams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public Exam findExamById(Long id) throws Exception {
        Exam exam = examRepository.findByExamID(id);
        if (exam == null) {
            throw new Exception("Exam not found!");
        }
        return exam;
    }

    @Override
    public Exam findByQuestion(long questionId) throws Exception {
        Question question = questionRepository.findById(questionId);
        if (question == null) {
            throw new Exception("Question not found!");
        }
        return question.getExam();
    }

    @Override
    public Exam saveExam(Professor professor, Exam exam) {
        for(User prof: exam.getProfessors()){
            if(professor.equals(prof)){
                return examRepository.save(exam);
            }
        }
        exam.addProfessor(professor);
        return examRepository.save(exam);
    }

    @Override
    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    @Override
    public Question addQuestion(Long examId, Question question) throws Exception {
        Exam exam = findExamById(examId);
        if(exam == null) {
            throw new RuntimeException("Exam not found");
        }

        question.setExam(exam);
        return questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
