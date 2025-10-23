package com.calculator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "he_presets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HePreset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "explosive_type_id")
    private ExplosiveType explosiveType;


    private String name;
    private Double diameter;        // mm
    private Double explosiveMass;   // kg
}
