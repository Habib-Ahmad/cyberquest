package com.example.demo.repositories;

import com.example.demo.models.Challenge;
import com.example.demo.models.Submission;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    List<Submission> findByUser(User user);
    List<Submission> findByChallenge(Challenge challenge);
    List<Submission> findByUserAndChallenge(User user, Challenge challenge);
    boolean existsByUserAndChallengeAndIsCorrectTrue(User user, Challenge challenge);
    List<Submission> findByUserAndIsCorrectTrue(User user);
}

