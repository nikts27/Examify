package com.example.exams.model;

import com.example.exams.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name="app_user")
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role")
public abstract class User {
    @Id
    @Column(unique = true, nullable = false)
    protected String username;

    private String fullName;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    protected USER_ROLE role;

    @ElementCollection
    @CollectionTable(
            name = "user_courses",
            joinColumns = @JoinColumn(name = "username")
    )
    @Column(name = "course_name")
    private List<String> userCourses;

    public abstract boolean equals(User user);
}
