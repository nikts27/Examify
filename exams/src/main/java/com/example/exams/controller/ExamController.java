package com.example.exams.controller;

import com.example.exams.model.*;
import com.example.exams.service.ExamService;
import com.example.exams.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> createOrUpdateExam(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Exam exam) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        if(!isUserAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to post exams for this course");
        }
        Exam savedExam = examService.saveExam(professor, exam);
        return new ResponseEntity<>(savedExam, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable String id) throws Exception {
        Exam exam = examService.findExamById(Long.parseLong(id));
        return new ResponseEntity<>(exam, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> deleteExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        Exam exam = examService.findExamById(id);
        if(!isUserAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to delete exams for this course");
        }
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{examId}/questions")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> addQuestion(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long examId,
            @RequestBody Question question) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        Exam exam = examService.findExamById(examId);
        if(!isUserAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to add questions for this exam");
        }

        Question savedQuestion = examService.addQuestion(examId, question);
        return ResponseEntity.ok(savedQuestion);
    }

    @DeleteMapping("/questions/{questionId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> deleteQuestion(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long questionId) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        Exam exam = examService.findByQuestion(questionId);
        if(!isUserAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to delete questions for this exam");
        }

        examService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/students/{studentId}/exams")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Exam>> getExamsForStudent(
            @RequestHeader("Authorization") String jwt) throws Exception {
        Student student = (Student)userService.findUserProfileByJwt(jwt);
        List<Exam> examsEnrolled = userService.getUserExams(student);
        return new ResponseEntity<>(examsEnrolled, HttpStatus.OK);
    }

    private boolean isUserAllowed(Exam exam, User user) {
        for(String user_course: user.getUserCourses()){
            if (user_course.equals(exam.getCourseExamined())){
                return true;
            }
        }
        return false;
    }
}
