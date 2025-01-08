package gr.nikts27.examify.service;

import gr.nikts27.examify.config.JwtProvider;
import gr.nikts27.examify.entity.Exam;
import gr.nikts27.examify.entity.StudentExam;
import gr.nikts27.examify.entity.User;
import gr.nikts27.examify.obj.Role;
import gr.nikts27.examify.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentExamService studentExamService;
    private final ExamService examService;
    private final CourseService courseService;

    public User findUserProfileByJwt(String jwt) throws Exception {
        String username = JwtProvider.getUsernameFromToken(jwt);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    public User findUserByUsername(String username) throws Exception {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    public List<?> getCoursesForUser(User user) throws Exception {
        if (user == null) throw new RuntimeException("User not found");

        if (user.getRole().equals(Role.STUDENT)) {
            return courseService.getCourseByStudent(user.getUsername());
        }

        if (user.getRole().equals(Role.PROFESSOR)){
            return courseService.getCourseByProfessor(user.getUsername());
        }

        return null;
    }

    public List<?> getExamsForUser(User user) throws Exception {
        if (user == null) throw new RuntimeException("User not found");
        return getUserExams(user);
    }

    public List<Exam> getUserExams(User user) {
        List<Exam> examList = new ArrayList<>();

        for (String course : user.getCourses()) {
            examList.addAll(examService.getByCourse(course));
        }
        if (user.getRole().equals(Role.STUDENT)) {
            examList.removeIf(exam -> !exam.getStudents().contains(user.getUsername()));
        }
        return examList;
    }

    public User updatePassword(String userId, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
