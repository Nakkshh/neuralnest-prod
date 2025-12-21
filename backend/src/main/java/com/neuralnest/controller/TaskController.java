package com.neuralnest.controller;

import com.neuralnest.entity.Task;
import com.neuralnest.repository.TaskRepository;
import com.neuralnest.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getTasks(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userEmail = jwtUtil.extractEmail(token);
            
            List<Task> tasks = taskRepository.findByUserEmail(userEmail);
            return ResponseEntity.ok(Map.of("tasks", tasks));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addTask(@RequestHeader("Authorization") String authHeader, 
                                   @RequestBody Map<String, Object> body) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userEmail = jwtUtil.extractEmail(token);
            
            String title = (String) body.get("title");
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title required"));
            }
            
            double loadScore = 0.3;
            Object loadObj = body.get("loadScore");
            if (loadObj instanceof Number) {
                loadScore = ((Number) loadObj).doubleValue();
            }
            
            Task task = new Task();
            task.setTitle(title.trim());
            task.setLoadScore(loadScore);
            task.setUserEmail(userEmail);
            
            taskRepository.save(task);
            
            return ResponseEntity.ok(Map.of("success", true, "task", task));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, 
                                      @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userEmail = jwtUtil.extractEmail(token);
            
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
