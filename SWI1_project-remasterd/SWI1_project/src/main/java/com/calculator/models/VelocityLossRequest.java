package com.calculator.models;

import org.antlr.v4.runtime.misc.NotNull;

public class VelocityLossRequest {
    @NotNull
    private Double initialVelocity;

    @NotNull
    private Double mass;

    @NotNull
    private Double diameter;

    @NotNull
    private Double dragCoefficient;

    @NotNull
    private Double airDensity;

    @NotNull
    private Double distance;

    // Getters and setters
    public Double getInitialVelocity() {
        return initialVelocity;
    }

    public void setInitialVelocity(Double initialVelocity) {
        this.initialVelocity = initialVelocity;
    }

    public Double getMass() {
        return mass;
    }

    public void setMass(Double mass) {
        this.mass = mass;
    }

    public Double getDiameter() {
        return diameter;
    }

    public void setDiameter(Double diameter) {
        this.diameter = diameter;
    }

    public Double getDragCoefficient() {
        return dragCoefficient;
    }

    public void setDragCoefficient(Double dragCoefficient) {
        this.dragCoefficient = dragCoefficient;
    }

    public Double getAirDensity() {
        return airDensity;
    }

    public void setAirDensity(Double airDensity) {
        this.airDensity = airDensity;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
}
