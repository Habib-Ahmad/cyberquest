package com.example.demo.controllers;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exceptions.RateLimitExceededException;
import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import com.example.demo.payload.request.ChallengeRequest;
import com.example.demo.payload.request.FlagSubmissionRequest;
import com.example.demo.security.RateLimitingService;
import com.example.demo.services.ChallengeService;
import com.example.demo.services.FileStorageService;
import com.example.demo.services.SubmissionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    ChallengeService challengeService;

    @Autowired
    SubmissionService submissionService;

    @Autowired
    RateLimitingService rateLimitingService;

    @Autowired
    FileStorageService fileStorageService;

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
    public ResponseEntity<?> submitFlag(@PathVariable UUID id, @Valid @RequestBody FlagSubmissionRequest request, Authentication authentication) {
        String username = authentication.getName();

        if (!rateLimitingService.tryConsumeFlagSubmission(username)) {
            throw new RateLimitExceededException("Too many flag submission attempts. Please wait before trying again.");
        }

        return ResponseEntity.ok(submissionService.submitFlag(id, request.getFlag(), username));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Fallback to default content type
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
