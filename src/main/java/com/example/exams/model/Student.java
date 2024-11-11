package com.example.exams.model;

import com.example.exams.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@DiscriminatorValue("STUDENT")
public class Student extends User {

    @ManyToMany(mappedBy = "assignedStudents")
    private List<Exam> examsEnrolled;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Submission> submissions;

    public Student() {
        super();
        this.role = USER_ROLE.ROLE_STUDENT;
    }

    @Override
    public boolean equals(User user) {
        return this.username.equals(user.getUsername());
    }
}
