package com.example.demo.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.models.ERole;
import com.example.demo.models.Role;
import com.example.demo.models.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;

@Configuration
public class DataInitialiser {

    @Bean
    @Order(1)
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(ERole.USER).isEmpty()) {
                Role userRole = new Role();
                userRole.setName(ERole.USER);
                roleRepository.save(userRole);
            }

            if (roleRepository.findByName(ERole.ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(ERole.ADMIN);
                roleRepository.save(adminRole);
            }
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner initAdminUser(UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists (case-insensitive)
            if (userRepository.findByUsernameIgnoreCase("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@cyberquest.com");
                admin.setPassword(passwordEncoder.encode("Admin123!"));
                admin.setCurrentScore(0);

                // Get roles
                Role userRole = roleRepository.findByName(ERole.USER)
                        .orElseThrow(() -> new RuntimeException("Error: USER Role not found."));
                Role adminRole = roleRepository.findByName(ERole.ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: ADMIN Role not found."));

                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                roles.add(adminRole);
                admin.setRoles(roles);

                userRepository.save(admin);
                System.out.println("✅ Admin user created: username=admin, password=Admin123!");
            }
        };
    }
}
