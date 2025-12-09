package com.example.demo.controllers;

import com.example.demo.payload.request.ChallengeRequest;
import com.example.demo.services.ChallengeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    ChallengeService challengeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createChallenge(@Valid @RequestBody ChallengeRequest request) {
        try {
            challengeService.createChallenge(request);
            return ResponseEntity.ok("Challenge created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}