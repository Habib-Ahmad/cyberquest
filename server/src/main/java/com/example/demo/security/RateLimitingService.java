package com.example.demo.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    // Store buckets per user for flag submissions
    private final Map<String, Bucket> flagSubmissionBuckets = new ConcurrentHashMap<>();

    // Store buckets per IP for login attempts
    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();

    // Flag submission: 5 attempts per minute per user
    public Bucket resolveFlagSubmissionBucket(String username) {
        return flagSubmissionBuckets.computeIfAbsent(username, this::createFlagSubmissionBucket);
    }

    private Bucket createFlagSubmissionBucket(String username) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillGreedy(5, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    // Login: 10 attempts per minute per IP
    public Bucket resolveLoginBucket(String ipAddress) {
        return loginBuckets.computeIfAbsent(ipAddress, this::createLoginBucket);
    }

    private Bucket createLoginBucket(String ipAddress) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(10)
                .refillGreedy(10, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    public boolean tryConsumeFlagSubmission(String username) {
        return resolveFlagSubmissionBucket(username).tryConsume(1);
    }

    public boolean tryConsumeLogin(String ipAddress) {
        return resolveLoginBucket(ipAddress).tryConsume(1);
    }
}
