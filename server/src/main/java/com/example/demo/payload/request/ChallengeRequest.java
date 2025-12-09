package com.example.demo.payload.request;

import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChallengeRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private EChallengeCategory category;

    @NotNull
    private EChallengeDifficulty difficulty;

    @NotNull
    private Integer points;

    @NotBlank
    private String flag;

    private String attachmentUrl;
}