package com.example.demo.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class LeaderboardEntry {
    private Integer rank;
    private UUID userId;
    private String username;
    private Integer score;
    private Integer solvedChallenges;
}

