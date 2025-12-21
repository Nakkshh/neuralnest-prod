package com.neuralnest.repository;

import com.neuralnest.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserEmail(String userEmail);
    void deleteByUserEmail(String userEmail);
}
