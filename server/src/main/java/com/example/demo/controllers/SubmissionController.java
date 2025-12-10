package com.example.demo.controllers;

import com.example.demo.services.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<?> getMySubmissions(Authentication authentication) {
        return ResponseEntity.ok(submissionService.getUserSubmissions(authentication.getName()));
    }

    @GetMapping("/solved")
    public ResponseEntity<?> getMySolvedChallenges(Authentication authentication) {
        return ResponseEntity.ok(submissionService.getSolvedChallenges(authentication.getName()));
    }
}

