package com.neuralnest.model;

public class Task {

    private Long id;
    private String name;
    private double loadCost;
    private boolean completed;

    public Task() {
    }

    public Task(Long id, String name, double loadCost) {
        this.id = id;
        this.name = name;
        this.loadCost = loadCost;
        this.completed = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLoadCost() {
        return loadCost;
    }

    public void setLoadCost(double loadCost) {
        this.loadCost = loadCost;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}