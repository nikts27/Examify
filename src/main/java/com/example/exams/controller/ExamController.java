package com.example.exams.controller;

import com.example.exams.model.*;
import com.example.exams.service.ExamService;
import com.example.exams.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    private final ExamService examService;
    private final UserService userService;

    public ExamController(ExamService examService, UserService userService) {
        this.examService = examService;
        this.userService = userService;
    }


    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> createOrUpdateExam(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Exam exam) throws Exception {
        
        System.out.println("Headers: " + ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest().getHeaderNames());
        System.out.println("Content-Type: " + ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest().getContentType());
        System.out.println("Received exam: " + exam);
        
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        if(!isProfAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to post exams for this course");
        }
        if (exam.getExamDate() != null && !exam.getExamDate().isBefore(LocalDate.now())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("The exam has been already hosted");
        }

        Exam savedExam = examService.saveExam(professor, exam);
        return new ResponseEntity<>(savedExam, HttpStatus.CREATED);
    }

    @PostMapping("/test")
    public ResponseEntity<Exam> testCreate() {
        Exam exam = new Exam();
        exam.setExamID(1);
        exam.setCourse(new Course());
        exam.setDuration(45);
        exam.setExamDate(LocalDate.now());
        exam.setTime(LocalTime.NOON);
        examService.saveExam(new Professor(), new Exam());

        return new ResponseEntity<>(exam, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable String id) throws Exception {
        Exam exam = examService.findExamById(Long.parseLong(id));
        return new ResponseEntity<>(exam, HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        return new ResponseEntity<>(exams, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> deleteExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception {
        Professor professor = (Professor)userService.findUserProfileByJwt(jwt);
        Exam exam = examService.findExamById(id);
        if(!isProfAllowed(exam, professor)){
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
        if(!isProfAllowed(exam, professor)){
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
        if(!isProfAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to delete questions for this exam");
        }

        examService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/professor/{profId}/exams")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> getExamsForProfessor(
            @RequestHeader("Authorization") String jwt, @PathVariable String profId) throws Exception {
        Professor prof = (Professor) userService.findUserProfileByJwt(jwt);
        if (!prof.getUsername().equals(profId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not authorized to complete this action");
        }

        List<Exam> examsEnrolled = userService.getUserExams(prof);
        return new ResponseEntity<>(examsEnrolled, HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}/exams")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getExamsForStudent(
            @RequestHeader("Authorization") String jwt, @PathVariable String studentId) throws Exception {
        Student student = (Student)userService.findUserProfileByJwt(jwt);
        if (!student.getUsername().equals(studentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("User not authorized to complete this action");
        }

        List<Exam> examsEnrolled = userService.getUserExams(student);
        return new ResponseEntity<>(examsEnrolled, HttpStatus.OK);
    }

    private boolean isProfAllowed(Exam exam, Professor prof) {
        for(Course prof_course: prof.getCoursesTaught()){
            if (prof_course.equals(exam.getCourse())){
                return true;
            }
        }
        return false;
    }
}
