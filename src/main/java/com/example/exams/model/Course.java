package com.example.exams.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private long examId;

    @ManyToMany
    @JoinTable(
            name = "course_professors",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
    @JsonBackReference
    private List<Professor> professors;

    @ManyToMany
    @JoinTable(
            name = "course_students",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<Student> students;

}
