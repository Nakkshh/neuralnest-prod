package com.neuralnest.controller;

import com.neuralnest.entity.BrainReport;
import com.neuralnest.repository.BrainReportRepository;
import com.neuralnest.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private BrainReportRepository brainReportRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/save")
    public ResponseEntity<?> saveReport(@RequestHeader("Authorization") String authHeader, 
                                      @RequestBody Map<String, Object> body) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userEmail = jwtUtil.extractEmail(token);
            
            BrainReport report = new BrainReport();
            report.setUserEmail(userEmail);
            report.setBrainLoad(Double.parseDouble(body.get("brainLoad").toString()));
            report.setSwitchCount(getInt(body, "switchCount", 0));
            report.setCharsPerMinute(getInt(body, "charsPerMinute", 0));
            report.setBurnoutRisk((String) body.get("burnoutRisk"));
            
            brainReportRepository.save(report);
            System.out.println("✅ SAVED BrainReport for " + userEmail);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            System.err.println("Report save error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getReports(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userEmail = jwtUtil.extractEmail(token);
            List<BrainReport> reports = brainReportRepository.findByUserEmailOrderByTimestampDesc(userEmail);
            return ResponseEntity.ok(Map.of("reports", reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    private int getInt(Map<String, Object> body, String key, int defaultValue) {
        try {
            Object value = body.get(key);
            return value != null ? Integer.parseInt(value.toString()) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
