package com.example.demo.controllers;

import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import com.example.demo.payload.request.ChallengeRequest;
import com.example.demo.payload.request.FlagSubmissionRequest;
import com.example.demo.services.ChallengeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    ChallengeService challengeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createChallenge(@Valid @RequestBody ChallengeRequest request) {
        return ResponseEntity.ok(challengeService.createChallenge(request));
    }

    @GetMapping
    public ResponseEntity<?> getAllChallenges(
            @RequestParam(required = false) EChallengeCategory category,
            @RequestParam(required = false) EChallengeDifficulty difficulty) {

        if (category != null && difficulty != null) {
            return ResponseEntity.ok(challengeService.getChallengesByCategoryAndDifficulty(category, difficulty));
        } else if (category != null) {
            return ResponseEntity.ok(challengeService.getChallengesByCategory(category));
        } else if (difficulty != null) {
            return ResponseEntity.ok(challengeService.getChallengesByDifficulty(difficulty));
        }
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChallengeById(@PathVariable UUID id) {
        return ResponseEntity.ok(challengeService.getChallengeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateChallenge(@PathVariable UUID id, @Valid @RequestBody ChallengeRequest request) {
        return ResponseEntity.ok(challengeService.updateChallenge(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteChallenge(@PathVariable UUID id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok("Challenge deleted successfully");
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitFlag(@PathVariable UUID id, @Valid @RequestBody FlagSubmissionRequest request) {
        boolean correct = challengeService.verifyFlag(id, request.getFlag());
        if (correct) {
            return ResponseEntity.ok("Correct flag!");
        }
        return ResponseEntity.badRequest().body("Incorrect flag");
    }
}