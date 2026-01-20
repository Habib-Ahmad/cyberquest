package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.User;
import com.example.demo.payload.response.LeaderboardEntry;
import com.example.demo.repositories.SubmissionRepository;
import com.example.demo.repositories.UserRepository;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public List<LeaderboardEntry> getLeaderboard() {
        List<User> users = userRepository.findAll();

        // Filter out admin users (cyberquest.com domain)
        users = users.stream()
                .filter(user -> !user.getEmail().endsWith("@cyberquest.com"))
                .toList();

        // Convert immutable list to mutable list for sorting
        users = new ArrayList<>(users);

        // Sort by score descending, then by last correct submission time ascending (earlier = better)
        users.sort(Comparator
                .comparing(User::getCurrentScore).reversed()
                .thenComparing(user -> submissionRepository
                .findLastCorrectSubmissionTimeByUser(user)
                .orElse(LocalDateTime.MAX)));

        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        int rank = 1;
        for (User user : users) {
            int solvedCount = submissionRepository.findByUserAndIsCorrectTrue(user).size();
            leaderboard.add(new LeaderboardEntry(
                    rank++,
                    user.getId(),
                    user.getUsername(),
                    user.getCurrentScore(),
                    solvedCount
            ));
        }

        return leaderboard;
    }

    public LeaderboardEntry getUserRank(String username) {
        List<LeaderboardEntry> leaderboard = getLeaderboard();
        return leaderboard.stream()
                .filter(entry -> entry.getUsername().equals(username))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("User not found in leaderboard"));
    }
}
