package com.neuralnest.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private double loadScore;
    
    @Column(nullable = false)
    private String userEmail;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Task() {}
    
    public Task(String title, double loadScore, String userEmail) {
        this.title = title;
        this.loadScore = loadScore;
        this.userEmail = userEmail;
    }
    
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public double getLoadScore() { return loadScore; }
    public void setLoadScore(double loadScore) { this.loadScore = loadScore; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
