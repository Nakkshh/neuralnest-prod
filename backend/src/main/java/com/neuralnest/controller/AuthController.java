package com.neuralnest.controller;

import com.neuralnest.entity.User;
import com.neuralnest.repository.UserRepository;
import com.neuralnest.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        User user = userRepository.findByEmail(body.get("email"))
                .orElse(null);
        
        if (user != null && passwordEncoder.matches(body.get("password"), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of("id", user.getId(), "email", user.getEmail())
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        if (userRepository.findByEmail(body.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }
        
        User user = new User();
        user.setEmail(body.get("email"));
        user.setPassword(passwordEncoder.encode(body.get("password")));
        user.setRole("USER");
        
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of("id", user.getId(), "email", user.getEmail())
        ));
    }
}
