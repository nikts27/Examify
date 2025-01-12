package gr.nikts27.examify.controller;

import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.service.ExamService;
import gr.nikts27.examify.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    private final ExamService examService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> createOrUpdateExam(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Exam exam) throws Exception {
        User professor = userService.findUserProfileByJwt(jwt);
        if(!professor.getCourses().contains(exam.getCourseId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to post exams for this course");
        }
        LocalDateTime start = convertToLocalDateTime(exam.getStartTime());
        if (exam.getStartTime() != null && start.isBefore(LocalDateTime.now())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("The exam has been already hosted");
        }

        Exam savedExam = examService.saveExam(exam, true);
        return new ResponseEntity<>(savedExam, HttpStatus.CREATED);
    }

    @GetMapping("/{examId}")
    public ResponseEntity<Exam> getExamById(@PathVariable String examId) throws Exception {
        Exam exam = examService.getByExamId(examId);
        return new ResponseEntity<>(exam, HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        return new ResponseEntity<>(exams, HttpStatus.OK);
    }

    @DeleteMapping("/{examId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> deleteExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String examId) throws Exception {
        User professor = userService.findUserProfileByJwt(jwt);
        Exam exam = examService.getByExamId(examId);
        if(!professor.getCourses().contains(exam.getCourseId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to delete exams for this course");
        }
        examService.deleteExam(examId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/take/{examId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> takePartExams(@RequestHeader("Authorization") String jwt, @PathVariable String examId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Exam exam = examService.getByExamId(examId);

        if (!user.getCourses().contains(exam.getCourseId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("He hasn't been registered for the course");
        }

        exam.getStudents().add(user.getUsername());
        Exam n = examService.saveExam(exam, false);
        return ResponseEntity.status(HttpStatus.OK)
                .body(n);
    }

    @PostMapping("/remove/{examId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> removeStudentFromExam(@RequestHeader("Authorization") String jwt, @PathVariable String examId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Exam exam = examService.getByExamId(examId);

        exam.getStudents().remove(user.getUsername());
        Exam n = examService.saveExam(exam, false);
        return ResponseEntity.status(HttpStatus.OK)
                .body(n);
    }

    public static LocalDateTime convertToLocalDateTime(String dateTimeString) {
        // Ορισμός του formatter που ταιριάζει στη μορφή της εισόδου
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // Μετατροπή της συμβολοσειράς σε LocalDateTime
        return LocalDateTime.parse(dateTimeString, formatter);
    }
}