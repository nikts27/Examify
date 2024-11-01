package com.example.exams.controller;

import com.example.exams.model.*;
import com.example.exams.service.ExamService;
import com.example.exams.service.SubmissionService;
import com.example.exams.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submit")
public class SubmitController {

    @Autowired
    private UserService userService;

    @Autowired
    private ExamService examService;

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitExam(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Submission submission) throws Exception {
        Student student = (Student)userService.findUserProfileByJwt(jwt);
        if(!isUserAllowed(submission.getExam(), student)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Student not allowed to submit for this exam");
        }

        Submission savedSubmission = submissionService.submitExam(submission);
        return ResponseEntity.ok(savedSubmission);
    }

    @GetMapping("/student/")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Submission>> getSubmissionsForStudent(
            @RequestHeader("Authorization") String jwt) throws Exception {
        Student student = (Student)userService.findUserProfileByJwt(jwt);
        List<Submission> submissions = submissionService.getSubmissionsForStudent(student.getUsername());
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> getSubmissionsForExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long examId) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        Exam exam = examService.findExamById(examId);
        if(!isUserAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to get submissions for this exam");
        }

        List<Submission> submissions = submissionService.getSubmissionsForExam(exam);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> gradeExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long submissionId,
            @RequestBody Map<Integer, Double> typicalQuestionScores) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        Submission submission = submissionService.findSubmissionById(submissionId);
        Exam exam = submission.getExam();
        if(!isUserAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to get submissions for this exam");
        }

        submission = submissionService.gradeExam(submission, typicalQuestionScores);
        return ResponseEntity.ok(submission);
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
