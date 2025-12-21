package com.neuralnest.repository;

import com.neuralnest.entity.BrainReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrainReportRepository extends JpaRepository<BrainReport, Long> {
    List<BrainReport> findByUserEmailOrderByTimestampDesc(String userEmail);
}
