package gr.nikts27.examify.service;

import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.repository.ExamRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class ExamService {

    private final ExamRepository examRepository;

    public List<Exam> getByCourse(String courseId) {
        return examRepository.findByCourseId(courseId);
    }

    public Exam getByExamId(String examId) {
        return examRepository.findExamByExamId(examId);
    }

    public void deleteExam(String examId) {
        examRepository.deleteByExamId(examId);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam saveExam(Exam exam, boolean first) {
        if (first) {
            exam.setStudents(new ArrayList<>());
        }
        return examRepository.save(exam);
    }
}
