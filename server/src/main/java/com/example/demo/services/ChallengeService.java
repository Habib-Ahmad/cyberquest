package com.example.demo.services;

import com.example.demo.models.Challenge;
import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import com.example.demo.payload.request.ChallengeRequest;
import com.example.demo.payload.response.ChallengeResponse;
import com.example.demo.repositories.ChallengeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChallengeService {

    @Autowired
    ChallengeRepository challengeRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Transactional
    public ChallengeResponse createChallenge(ChallengeRequest request) {
        if (challengeRepository.existsByTitle(request.getTitle())) {
            throw new IllegalArgumentException("Challenge title already exists");
        }

        String hashedFlag = passwordEncoder.encode(request.getFlag());

        Challenge challenge = Challenge.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .points(request.getPoints())
                .flagHash(hashedFlag)
                .attachmentUrl(request.getAttachmentUrl())
                .build();

        Challenge saved = challengeRepository.save(challenge);
        return mapToResponse(saved);
    }

    public ChallengeResponse getChallengeById(UUID id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));
        return mapToResponse(challenge);
    }

    public List<ChallengeResponse> getAllChallenges() {
        return challengeRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ChallengeResponse> getChallengesByCategory(EChallengeCategory category) {
        return challengeRepository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ChallengeResponse> getChallengesByDifficulty(EChallengeDifficulty difficulty) {
        return challengeRepository.findByDifficulty(difficulty).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ChallengeResponse> getChallengesByCategoryAndDifficulty(EChallengeCategory category, EChallengeDifficulty difficulty) {
        return challengeRepository.findByCategoryAndDifficulty(category, difficulty).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ChallengeResponse updateChallenge(UUID id, ChallengeRequest request) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (!challenge.getTitle().equals(request.getTitle()) && challengeRepository.existsByTitle(request.getTitle())) {
            throw new IllegalArgumentException("Challenge title already exists");
        }

        challenge.setTitle(request.getTitle());
        challenge.setDescription(request.getDescription());
        challenge.setCategory(request.getCategory());
        challenge.setDifficulty(request.getDifficulty());
        challenge.setPoints(request.getPoints());
        challenge.setAttachmentUrl(request.getAttachmentUrl());

        if (request.getFlag() != null && !request.getFlag().isBlank()) {
            challenge.setFlagHash(passwordEncoder.encode(request.getFlag()));
        }

        Challenge saved = challengeRepository.save(challenge);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteChallenge(UUID id) {
        if (!challengeRepository.existsById(id)) {
            throw new IllegalArgumentException("Challenge not found");
        }
        challengeRepository.deleteById(id);
    }

    public boolean verifyFlag(UUID challengeId, String submittedFlag) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));
        return passwordEncoder.matches(submittedFlag, challenge.getFlagHash());
    }

    private ChallengeResponse mapToResponse(Challenge challenge) {
        return modelMapper.map(challenge, ChallengeResponse.class);
    }
}