package gr.nikts27.examify.service;

import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.entity.StudentExam;
import gr.nikts27.examify.repository.ExamRepository;
import gr.nikts27.examify.repository.StudentExamRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@AllArgsConstructor
@Service
public class StudentExamService {

    private final StudentExamRepository studentExamRepository;
    private final ExamRepository examRepository;

    public StudentExam getStudentExam(String id) {
        return studentExamRepository.findById(id).orElse(null);
    }

    public List<StudentExam> getStudentExamsById(String studentId) {
        return studentExamRepository.findByStudentId(studentId);
    }

    public StudentExam saveStudentExam(StudentExam studentExam) {
        return studentExamRepository.save(studentExam);
    }

    public List<StudentExam> getSubmissionsForExam(Exam exam) {
        return studentExamRepository.findByExamId(exam.getExamId());
    }

    public StudentExam gradeExam(StudentExam studentExam, Map<String, Integer> typicalQuestionScores) {

        Exam exam = examRepository.findExamByExamId(studentExam.getExamId());

        if (exam == null) {
            throw new IllegalArgumentException("Exam not found");
        }

        int grade = 0;
        int maxGrade = 0;

        List<StudentExam.Answer> answers = studentExam.getAnswers();

        // multiple choice grades
        for (Exam.MultipleChoiceQuestion multipleChoiceQuestion : exam.getMultipleChoiceQuestions()) {
            StudentExam.Answer answer = getAnswerById(multipleChoiceQuestion.getQuestionId(), answers);
            String correct = Integer.toString(multipleChoiceQuestion.getCorrectOption());
            maxGrade += multipleChoiceQuestion.getScore();

            if (correct.equals(answer.getSelectedOption())) {
                grade += multipleChoiceQuestion.getScore();
            } else {
                grade -= multipleChoiceQuestion.getNegativeScore();
            }
        }

        // true or false grades
        for (Exam.TrueOrFalseQuestion trueOrFalseQuestion : exam.getTrueOrFalseQuestions()) {
            StudentExam.Answer answer = getAnswerById(trueOrFalseQuestion.getQuestionId(), answers);
            String correct = "false";
            if (trueOrFalseQuestion.isCorrectOption()) {
                correct = "true";
            }
            maxGrade += trueOrFalseQuestion.getScore();

            if (correct.equals(answer.getSelectedOption())) {
                grade += trueOrFalseQuestion.getScore();
            } else {
                grade -= trueOrFalseQuestion.getNegativeScore();
            }
        }

        for (Exam.TypicalQuestion typicalQuestion : exam.getTypicalQuestions()) {
            maxGrade += typicalQuestion.getScore();
        }

        //typical questions
        for (String questionId: typicalQuestionScores.keySet()) {
            grade += typicalQuestionScores.get(questionId);
        }

        // round up grade
        grade = (grade*10) / maxGrade;

        studentExam.setGrade(grade);

        return studentExamRepository.save(studentExam);
    }

    public StudentExam.Answer getAnswerById(String id,List<StudentExam.Answer> answers ) {
        for (StudentExam.Answer answer : answers) {
            if (answer.getQuestionId().equals(id)) {
                return answer;
            }
        }
        return null;
    }
}
