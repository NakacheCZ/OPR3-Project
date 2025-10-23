package com.calculator.models;

public class FullCaliberPresetResponse {
    private Long id;
    private String name;
    private Double mass;
    private Double velocity;
    private Double diameter;
    private Double range;
    private Double angle;
    private Double constant;
    private Double thicknessExponent;
    private Double scaleExponent;

    public FullCaliberPresetResponse(Long id, String name, Double mass, Double velocity, Double diameter, Double range,
                                     Double angle, Double constant, Double thicknessExponent, Double scaleExponent) {
        this.id = id;
        this.name = name;
        this.mass = mass;
        this.velocity = velocity;
        this.diameter = diameter;
        this.range = range;
        this.angle = angle;
        this.constant = constant;
        this.thicknessExponent = thicknessExponent;
        this.scaleExponent = scaleExponent;
    }

    // Gettery a settery
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

    public Double getDiameter() {
        return diameter;
    }

    public void setDiameter(Double diameter) {
        this.diameter = diameter;
    }

    public Double getRange() {
        return range;
    }

    public void setRange(Double range) {
        this.range = range;
    }

    public Double getAngle() {
        return angle;
    }

    public void setAngle(Double angle) {
        this.angle = angle;
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
}