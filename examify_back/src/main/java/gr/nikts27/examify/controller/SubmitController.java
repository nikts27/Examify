package gr.nikts27.examify.controller;


import gr.nikts27.examify.entity.Course;
import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.entity.StudentExam;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.service.CourseService;
import gr.nikts27.examify.service.ExamService;
import gr.nikts27.examify.service.StudentExamService;
import gr.nikts27.examify.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/submit")
public class SubmitController {

    private final UserService userService;
    private final ExamService examService;
    private final CourseService courseService;
    private final StudentExamService studentExamService;


    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitExam(
            @RequestHeader("Authorization") String jwt,
            @RequestBody StudentExam studentExam) throws Exception {
        studentExam.setSubmittedAt(LocalDateTime.now());
        studentExam.setStudentId(userService.findUserProfileByJwt(jwt).getUsername());
        studentExam.setGrade(0);
        StudentExam stuExam = studentExamService.saveStudentExam(studentExam);
        return ResponseEntity.ok(stuExam);
    }

    //get asd
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<StudentExam>> getSubmissionsForStudent(
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<StudentExam> studentExams = studentExamService.getStudentExamsById(user.getUsername());
        return ResponseEntity.ok(studentExams);
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> getSubmissionsForExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String examId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Exam exam = examService.getByExamId(examId);

        if(!isProfAllowed(exam, user)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to get submissions for this exam");
        }

        List<StudentExam> submissions = studentExamService.getSubmissionsForExam(exam);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping("/reg/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> registerInCourse(@RequestHeader("Authorization") String jwt,
                                              @PathVariable String courseId) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Course course = courseService.getCourse(courseId);

        user.getCourses().add(course.getId());
        userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.OK)
                .body("added student");
    }

    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> gradeExam(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String submissionId,
            @RequestBody Map<String, Integer> typicalQuestionScores) throws Exception {
        User professor = userService.findUserProfileByJwt(jwt);
        StudentExam studentExam = studentExamService.getStudentExam(submissionId);
        Exam exam = examService.getByExamId(studentExam.getExamId());

        if(!isProfAllowed(exam, professor)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Professor not allowed to get submissions for this exam");
        }

        studentExam = studentExamService.gradeExam(studentExam, typicalQuestionScores);
        return ResponseEntity.ok(studentExam);
    }

    private boolean isProfAllowed(Exam exam, User prof) {
        for(Course prof_course: courseService.getCourseByProfessor(prof.getUsername())){
            if (prof_course.getCode().equals(exam.getCourseId())){
                return true;
            }
        }
        return false;
    }
}
