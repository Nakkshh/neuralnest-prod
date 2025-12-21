package com.neuralnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "brain_reports")
public class BrainReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private double brainLoad;
    
    private int switchCount;
    private int charsPerMinute;
    private String burnoutRisk;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    public BrainReport() {}
    
    public BrainReport(String userEmail, double brainLoad, int switchCount, int charsPerMinute, String burnoutRisk) {
        this.userEmail = userEmail;
        this.brainLoad = brainLoad;
        this.switchCount = switchCount;
        this.charsPerMinute = charsPerMinute;
        this.burnoutRisk = burnoutRisk;
    }
    
    // ✅ ALL REQUIRED GETTERS/SETTERS:
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public double getBrainLoad() { return brainLoad; }
    public void setBrainLoad(double brainLoad) { this.brainLoad = brainLoad; }
    
    public int getSwitchCount() { return switchCount; }
    public void setSwitchCount(int switchCount) { this.switchCount = switchCount; }
    
    // ✅ FIXED: MISSING SETTERS
    public int getCharsPerMinute() { return charsPerMinute; }
    public void setCharsPerMinute(int charsPerMinute) { this.charsPerMinute = charsPerMinute; }
    
    public String getBurnoutRisk() { return burnoutRisk; }
    public void setBurnoutRisk(String burnoutRisk) { this.burnoutRisk = burnoutRisk; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
