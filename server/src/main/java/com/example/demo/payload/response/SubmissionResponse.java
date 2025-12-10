package com.example.demo.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class SubmissionResponse {
    private UUID id;
    private UUID challengeId;
    private String challengeTitle;
    private boolean correct;
    private Integer pointsAwarded;
    private LocalDateTime submissionTime;
}

