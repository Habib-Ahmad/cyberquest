package com.example.demo.services;

import com.example.demo.models.Challenge;
import com.example.demo.payload.request.ChallengeRequest;
import com.example.demo.repositories.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChallengeService {

    @Autowired
    ChallengeRepository challengeRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Transactional
    public Challenge createChallenge(ChallengeRequest request) throws Exception {

        if (challengeRepository.existsByTitle(request.getTitle())) {
            throw new Exception("Error: Challenge title already exists!");
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

        return challengeRepository.save(challenge);
    }
}