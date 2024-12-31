package com.example.exams.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@DiscriminatorValue("ROLE_PROFESSOR")
public class Professor extends User {

    @ManyToMany(mappedBy = "professors")
    private List<Course> coursesTaught;

    @ManyToMany(mappedBy = "professors")
    @JsonBackReference
    private List<Exam> examsCreated;

    @Override
    public boolean equals(User user) {
        return this.username.equals(user.getUsername());
    }
}
