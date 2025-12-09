package com.example.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "roles")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(length = 20)
    private ERole name;
}
