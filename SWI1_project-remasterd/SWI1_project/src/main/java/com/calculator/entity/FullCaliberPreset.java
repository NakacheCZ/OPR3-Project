package com.calculator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "full_caliber_presets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FullCaliberPreset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double mass;          // kg
    private Double velocity;      // m/s
    private Double angle;         // radians
    private Double diameter;      // mm
    private Double constant;      // k
    private Double thicknessExponent;  // n
    private Double scaleExponent;      // s
    private Double range;         // m
    private Long userId;
    private boolean basePreset;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMass() {
        return mass;
    }

    public void setMass(Double mass) {
        this.mass = mass;
    }

    public Double getVelocity() {
        return velocity;
    }

    public void setVelocity(Double velocity) {
        this.velocity = velocity;
    }

    public Double getAngle() {
        return angle;
    }

    public void setAngle(Double angle) {
        this.angle = angle;
    }

    public Double getDiameter() {
        return diameter;
    }

    public void setDiameter(Double diameter) {
        this.diameter = diameter;
    }

    public Double getConstant() {
        return constant;
    }

    public void setConstant(Double constant) {
        this.constant = constant;
    }

    public Double getThicknessExponent() {
        return thicknessExponent;
    }

    public void setThicknessExponent(Double thicknessExponent) {
        this.thicknessExponent = thicknessExponent;
    }

    public Double getScaleExponent() {
        return scaleExponent;
    }

    public void setScaleExponent(Double scaleExponent) {
        this.scaleExponent = scaleExponent;
    }

    public Double getRange() {
        return range;
    }

    public void setRange(Double range) {
        this.range = range;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isBasePreset() {
        return basePreset;
    }

    public void setBasePreset(boolean basePreset) {
        this.basePreset = basePreset;
    }
}
