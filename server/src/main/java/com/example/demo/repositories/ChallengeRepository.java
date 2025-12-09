package com.example.demo.repositories;

import com.example.demo.models.Challenge;
import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {
    boolean existsByTitle(String title);
    List<Challenge> findByCategory(EChallengeCategory category);
    List<Challenge> findByDifficulty(EChallengeDifficulty difficulty);
    List<Challenge> findByCategoryAndDifficulty(EChallengeCategory category, EChallengeDifficulty difficulty);
}
