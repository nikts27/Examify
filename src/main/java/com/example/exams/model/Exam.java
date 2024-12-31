package com.example.exams.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long examID;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private int duration;
    private double score;

    @Temporal(TemporalType.DATE)
    private Date examDate;

    private String time;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Question> questionList;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "exam_professors",
            joinColumns = @JoinColumn(name = "exam_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
    @JsonManagedReference
    private List<Professor> professors;

    @ManyToMany
    @JoinTable(
            name = "exam_students",
            joinColumns = @JoinColumn(name = "exam_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<Student> assignedStudents;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    private List<Submission> submissions;

    public void addProfessor(Professor professor) {
        professors.add(professor);
    }
}
