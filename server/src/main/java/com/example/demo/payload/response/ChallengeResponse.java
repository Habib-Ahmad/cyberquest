package com.example.demo.payload.response;

import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChallengeResponse {
    private UUID id;
    private String title;
    private String description;
    private EChallengeCategory category;
    private EChallengeDifficulty difficulty;
    private Integer points;
    private String attachmentUrl;
}