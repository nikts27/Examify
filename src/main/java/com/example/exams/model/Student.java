package com.example.exams.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@DiscriminatorValue("ROLE_STUDENT")
public class Student extends User {

    @ManyToMany(mappedBy = "students")
    private List<Course> coursesTaken;

    @ManyToMany(mappedBy = "assignedStudents")
    private List<Exam> examsEnrolled;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Submission> submissions;

    @Override
    public boolean equals(User user) {
        return this.username.equals(user.getUsername());
    }
}
