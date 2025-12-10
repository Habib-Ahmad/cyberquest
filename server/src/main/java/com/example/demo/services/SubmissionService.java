package com.example.demo.services;

import com.example.demo.models.Challenge;
import com.example.demo.models.Submission;
import com.example.demo.models.User;
import com.example.demo.payload.response.SubmissionResponse;
import com.example.demo.repositories.ChallengeRepository;
import com.example.demo.repositories.SubmissionRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public SubmissionResponse submitFlag(UUID challengeId, String flag, String username) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user already solved this challenge
        if (submissionRepository.existsByUserAndChallengeAndIsCorrectTrue(user, challenge)) {
            throw new IllegalArgumentException("You have already solved this challenge");
        }

        boolean isCorrect = passwordEncoder.matches(flag, challenge.getFlagHash());

        Submission submission = Submission.builder()
                .user(user)
                .challenge(challenge)
                .flagAttempt(flag)
                .isCorrect(isCorrect)
                .build();

        submissionRepository.save(submission);

        Integer pointsAwarded = 0;
        if (isCorrect) {
            // Update user's score
            user.setCurrentScore(user.getCurrentScore() + challenge.getPoints());
            userRepository.save(user);
            pointsAwarded = challenge.getPoints();
        }

        return new SubmissionResponse(
                submission.getId(),
                challenge.getId(),
                challenge.getTitle(),
                isCorrect,
                pointsAwarded,
                submission.getSubmissionTime()
        );
    }

    public List<SubmissionResponse> getUserSubmissions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return submissionRepository.findByUser(user).stream()
                .map(s -> new SubmissionResponse(
                        s.getId(),
                        s.getChallenge().getId(),
                        s.getChallenge().getTitle(),
                        s.isCorrect(),
                        s.isCorrect() ? s.getChallenge().getPoints() : 0,
                        s.getSubmissionTime()
                ))
                .toList();
    }

    public List<SubmissionResponse> getSolvedChallenges(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return submissionRepository.findByUserAndIsCorrectTrue(user).stream()
                .map(s -> new SubmissionResponse(
                        s.getId(),
                        s.getChallenge().getId(),
                        s.getChallenge().getTitle(),
                        true,
                        s.getChallenge().getPoints(),
                        s.getSubmissionTime()
                ))
                .toList();
    }
}

