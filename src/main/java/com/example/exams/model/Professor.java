package com.example.exams.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@DiscriminatorValue("ROLE_PROFESSOR")
@JsonIgnoreProperties("professors")
public class Professor extends User {

    @ManyToMany(mappedBy = "professors")
    @JsonManagedReference
    private List<Course> coursesTaught;

    @ManyToMany(mappedBy = "professors")
    private List<Exam> examsCreated;
}
