package com.example.exams.controller;

import com.example.exams.model.*;
import com.example.exams.service.ExamService;
import com.example.exams.service.SubmissionService;
import com.example.exams.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submit")
public class SubmitController {

    private final UserService userService;
    private final ExamService examService;
    private final SubmissionService submissionService;

    public SubmitController(UserService userService, ExamService examService, SubmissionService submissionService) {
        this.userService = userService;
        this.examService = examService;
        this.submissionService = submissionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitExam(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Submission submission) throws Exception {
        Student student = (Student)userService.findUserProfileByJwt(jwt);
        if(!isStudentAllowed(submission.getExam(), student)){
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
        if(!isProfAllowed(exam, professor)){
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
        if(!isProfAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to get submissions for this exam");
        }

        submission = submissionService.gradeExam(submission, typicalQuestionScores);
        return ResponseEntity.ok(submission);
    }


    private boolean isProfAllowed(Exam exam, Professor prof) {
        for(Course prof_course: prof.getCoursesTaught()){
            if (prof_course.equals(exam.getCourse())){
                return true;
            }
        }
        return false;
    }

    private boolean isStudentAllowed(Exam exam, Student stud) {
        for(Course stud_course: stud.getCoursesTaken()){
            if (stud_course.equals(exam.getCourse())){
                return true;
            }
        }
        return false;
    }
}
