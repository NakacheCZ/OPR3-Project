package com.calculator.models;

import jakarta.validation.constraints.NotNull;

public class FullCaliberRequest {
    @jakarta.validation.constraints.NotNull(message = "Mass is required")
    private Double mass;

    @jakarta.validation.constraints.NotNull(message = "Velocity is required")
    private Double velocity;

    @jakarta.validation.constraints.NotNull(message = "Angle is required")
    private Double angle;

    @jakarta.validation.constraints.NotNull(message = "Diameter is required")
    private Double diameter;

    @jakarta.validation.constraints.NotNull(message = "Material Coefficient is required")
    private Double materialCoefficient;

    @jakarta.validation.constraints.NotNull(message = "Material Exponent is required")
    private Double materialExponent;

    @NotNull(message = "Resistance Coefficient is required")
    private Double resistanceCoefficient;

    private Double range;

    public Double getRange() {
        return range;
    }

    public void setRange(Double range) {
        this.range = range;
    }

    // Getters and setters
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

    public Double getMaterialCoefficient() {
        return materialCoefficient;
    }

    public void setMaterialCoefficient(Double materialCoefficient) {
        this.materialCoefficient = materialCoefficient;
    }

    public Double getMaterialExponent() {
        return materialExponent;
    }

    public void setMaterialExponent(Double materialExponent) {
        this.materialExponent = materialExponent;
    }

    public Double getResistanceCoefficient() {
        return resistanceCoefficient;
    }

    public void setResistanceCoefficient(Double resistanceCoefficient) {
        this.resistanceCoefficient = resistanceCoefficient;
    }
}
