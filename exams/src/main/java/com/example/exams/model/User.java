package com.example.exams.model;

import com.example.exams.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
public abstract class User {
    @Id
    @Column(unique = true, nullable = false)
    protected String username;

    protected String fullName;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    protected String password;

    protected USER_ROLE role;

    @ElementCollection(fetch = FetchType.EAGER)
    protected List<String> userCourses;
}
