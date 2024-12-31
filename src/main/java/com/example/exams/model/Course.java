package com.example.exams.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Course {

    @Id
    @Column(unique = true, nullable = false)
    private String code;

    private String name;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Exam> exams;

    @ManyToMany
    @JoinTable(
            name = "course_professors",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<Professor> professors;

    @ManyToMany
    @JoinTable(
            name = "course_students",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<Student> students;

    public void addExam(Exam exam) {
        exams.add(exam);
        exam.setCourse(this);
    }

}
