package com.example.exams.model;

import com.example.exams.domain.USER_ROLE;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.Data;

import java.util.List;

@Entity
@Data
@DiscriminatorValue("PROFESSOR")
public class Professor extends User {

    @ManyToMany(mappedBy = "professors")
    private List<Exam> examsCreated;

    public Professor() {
        super();
        this.role = USER_ROLE.ROLE_PROFESSOR;
    }


    @Override
    public boolean equals(User user) {
        return this.username.equals(user.getUsername());
    }
}
