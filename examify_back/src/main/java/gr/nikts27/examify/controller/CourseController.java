package gr.nikts27.examify.controller;

import gr.nikts27.examify.entity.Course;
import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.service.CourseService;
import gr.nikts27.examify.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/course")
@AllArgsConstructor
public class CourseController {

    private final UserService userService;
    private final CourseService courseService;

    @PostMapping("/reg/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> registerInCourse(@RequestHeader("Authorization") String jwt,
                                              @PathVariable String courseId) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Course course = courseService.getCourse(courseId);

        course.getStudents().add(user.getId());
        courseService.save(course);
        return ResponseEntity.status(HttpStatus.OK)
                .body("added student");
    }
}
