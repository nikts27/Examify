package com.example.exams.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long examID;
}
