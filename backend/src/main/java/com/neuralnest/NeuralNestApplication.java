package com.neuralnest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class NeuralNestApplication {

    @GetMapping("/")
    public String home() {
        return "🧠 NeuralNest Backend is LIVE! 🚀 http://localhost:8080";
    }

    public static void main(String[] args) {
        SpringApplication.run(NeuralNestApplication.class, args);
    }
}
