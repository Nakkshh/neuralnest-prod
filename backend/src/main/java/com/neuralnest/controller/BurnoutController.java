package com.neuralnest.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neuralnest.service.CognitiveService;
import com.neuralnest.service.CognitiveService.BurnoutAlert;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/brain")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BurnoutController {

    private final CognitiveService cognitiveService;

    public BurnoutController(CognitiveService cognitiveService) {
        this.cognitiveService = cognitiveService;
    }

    @PostMapping("/burnout")
    public ResponseEntity<BurnoutAlert> predictBurnout(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        System.out.println("Burnout API - Auth header: " + request.getHeader("Authorization"));
        Object eyeScoreObj = payload.get("eyeScore");
        Object totalLoadObj = payload.get("totalLoad");

        if (!(eyeScoreObj instanceof Number) || !(totalLoadObj instanceof Number)) {
            return ResponseEntity.badRequest().build();
        }

        double eyeScore = ((Number) eyeScoreObj).doubleValue();
        double totalLoad = ((Number) totalLoadObj).doubleValue();

        BurnoutAlert alert = cognitiveService.predictBurnout(eyeScore, totalLoad);
        return ResponseEntity.ok(alert);
    }
}
