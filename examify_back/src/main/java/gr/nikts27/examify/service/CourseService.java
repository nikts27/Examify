package gr.nikts27.examify.service;

import gr.nikts27.examify.entity.Course;
import gr.nikts27.examify.repository.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public Course getCourse(String id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course save(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getCourseByProfessor(String id) {
        return courseRepository.findByProfessorsContaining(id);
    }

    public List<Course> getCourseByStudent(String id) {
        return courseRepository.findByStudentsContaining(id);
    }
}
