package com.example.demo.services;

import com.example.demo.models.ERole;
import com.example.demo.models.Role;
import com.example.demo.models.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.InputSanitizer;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    InputSanitizer inputSanitizer;

    @Transactional
    public User registerUser(String username, String email, String password) throws Exception {
        // Sanitize inputs
        String sanitizedUsername = inputSanitizer.sanitizeUsername(username);
        String sanitizedEmail = inputSanitizer.sanitizeEmail(email);

        if (userRepository.existsByUsername(sanitizedUsername)) {
            throw new Exception("Error: Username already taken!");
        }
        if (userRepository.existsByEmail(sanitizedEmail)) {
            throw new Exception("Error: Email is already in use!");
        }

        User user = new User();

        user.setUsername(sanitizedUsername);
        user.setEmail(sanitizedEmail);
        user.setPassword(encoder.encode(password));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role not found in database. Did the DataInitialiser run?"));
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }
}
