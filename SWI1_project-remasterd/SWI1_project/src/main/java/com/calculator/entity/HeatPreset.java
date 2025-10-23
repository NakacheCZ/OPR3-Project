package com.calculator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "heat_presets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeatPreset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "explosive_type_id", nullable = false)
    private ExplosiveType explosiveType;

    private String name;
    private Double diameter;        // mm
    private Double explosiveMass;   // kg
    private Double coefficient;
    private Double efficiency;      // %
    private Double penetration;     // mm
}
