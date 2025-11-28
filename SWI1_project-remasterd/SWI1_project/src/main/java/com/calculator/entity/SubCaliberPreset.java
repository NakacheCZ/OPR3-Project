package com.calculator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sub_caliber_presets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCaliberPreset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double totalLength;
    private Double diameter;
    private Double densityPenetrator;
    private Double hardnessPenetrator;
    private Double velocity;
    private Double densityTarget;
    private Double hardnessTarget;
    private Double angle;
    private String material;
    private Double range;
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

    public Double getTotalLength() {
        return totalLength;
    }

    public void setTotalLength(Double totalLength) {
        this.totalLength = totalLength;
    }

    public Double getDiameter() {
        return diameter;
    }

    public void setDiameter(Double diameter) {
        this.diameter = diameter;
    }

    public Double getDensityPenetrator() {
        return densityPenetrator;
    }

    public void setDensityPenetrator(Double densityPenetrator) {
        this.densityPenetrator = densityPenetrator;
    }

    public Double getHardnessPenetrator() {
        return hardnessPenetrator;
    }

    public void setHardnessPenetrator(Double hardnessPenetrator) {
        this.hardnessPenetrator = hardnessPenetrator;
    }

    public Double getVelocity() {
        return velocity;
    }

    public void setVelocity(Double velocity) {
        this.velocity = velocity;
    }

    public Double getDensityTarget() {
        return densityTarget;
    }

    public void setDensityTarget(Double densityTarget) {
        this.densityTarget = densityTarget;
    }

    public Double getHardnessTarget() {
        return hardnessTarget;
    }

    public void setHardnessTarget(Double hardnessTarget) {

        this.hardnessTarget = hardnessTarget;
    }

    public Double getAngle() {
        return angle;
    }

    public void setAngle(Double angle) {
        this.angle = angle;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
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
