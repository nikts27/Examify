package com.example.exams.model;

import com.example.exams.domain.USER_ROLE;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("PROFESSOR")
public class Professor extends User {

    public Professor() {
        super();
        this.role = USER_ROLE.ROLE_PROFESSOR;
    }
}
