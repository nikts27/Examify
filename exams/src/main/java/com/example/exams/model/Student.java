package com.example.exams.model;

import com.example.exams.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("STUDENT")
public class Student extends User {

    public Student() {
        super();
        this.role = USER_ROLE.ROLE_STUDENT;
    }
}
