package com.example.exams.model;

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

    private String courseExamined;
    private int duration;
    private double score;

    @Temporal(TemporalType.DATE)
    private Date examDate;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Question> questionList;

    @ManyToMany
    @JoinTable(
            name = "exam_professors",
            joinColumns = @JoinColumn(name = "exam_id"),
            inverseJoinColumns = @JoinColumn(name = "username")
    )
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
