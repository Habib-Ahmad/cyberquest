package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameIgnoreCase(String username);

    Boolean existsByUsername(String username);

    Boolean existsByUsernameIgnoreCase(String username);

    Boolean existsByEmail(String email);

    List<User> findAllByOrderByCurrentScoreDesc();
}
