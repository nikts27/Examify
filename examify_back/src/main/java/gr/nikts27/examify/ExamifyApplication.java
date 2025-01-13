package gr.nikts27.examify;

import gr.nikts27.examify.repository.CourseRepository;
import gr.nikts27.examify.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ExamifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExamifyApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(UserRepository userRepository, PasswordEncoder passwordEncoder, CourseRepository courseRepository) {
		return args -> {
//			User student = new User();
//			student.setFullName("Nikolaos Tsaridis");
//			student.setUsername("ics22089");
//			student.setEmail("ics22089@uom.edu.gr");
//			student.setPassword(passwordEncoder.encode("cj-42gpd"));
//			student.setCourses(List.of("CS101"));
//			student.setRole(Role.STUDENT);
//			student.setCreatedAt(LocalDateTime.now());
//			userRepository.insert(student);
//
//			User professor = new User();
//			professor.setFullName("John Doe");
//			professor.setUsername("johndoe");
//			professor.setEmail("johndoe@uom.edu.gr");
//			professor.setPassword(passwordEncoder.encode("12345678"));
//			professor.setCourses(List.of("CS101"));
//			professor.setRole(Role.PROFESSOR);
//			professor.setCreatedAt(LocalDateTime.now());
//			userRepository.insert(professor);
//
//			Course course = new Course();
//			course.setCode("CS101");
//			course.setTitle("Introduction to Computer Science");
//			course.setProfessors(List.of("johndoe"));
//			course.setStudents(List.of("ics22089"));
//
//			courseRepository.save(course);

		};
	}

}
