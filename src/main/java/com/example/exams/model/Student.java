package com.example.exams.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@DiscriminatorValue("ROLE_STUDENT")
@JsonIgnoreProperties("students")
public class Student extends User {

    @ManyToMany(mappedBy = "students")
    private List<Course> coursesTaken;

    @ManyToMany(mappedBy = "assignedStudents")
    private List<Exam> examsEnrolled;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Submission> submissions;
}
