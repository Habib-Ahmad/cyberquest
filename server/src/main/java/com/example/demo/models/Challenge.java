package com.example.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EChallengeCategory category;

    @NotBlank
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EChallengeDifficulty difficulty;

    @NotNull
    @Column(nullable = false)
    private Integer points;

    @NotBlank
    @Column(name = "flag_hash", nullable = false)
    private String flagHash;

    @Column(name = "attachment_url")
    private String attachmentUrl;
}
