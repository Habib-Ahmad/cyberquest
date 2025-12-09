package com.example.demo.config;

import com.example.demo.models.ERole;
import com.example.demo.models.Role;
import com.example.demo.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitialiser {

    @Bean
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
}
