package com.example.demo.repositories;

import com.example.demo.models.ERole;
import com.example.demo.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(ERole name);
}
