package gr.nikts27.examify.repository;

import gr.nikts27.examify.entity.StudentExam;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentExamRepository extends MongoRepository<StudentExam, String> {

    List<StudentExam> findByStudentId(String studentId);

    List<StudentExam> findByExamId(String examId);
}
