package com.calculator.models;

import org.antlr.v4.runtime.misc.NotNull;

public class SubCaliberRequest {
    @NotNull
    private Double totalLength;

    @NotNull
    private Double diameter;

    @NotNull
    private Double velocity;

    @NotNull
    private Double densityPenetrator;

    @NotNull
    private Double hardnessPenetrator;

    @NotNull
    private Double densityTarget;

    @NotNull
    private Double hardnessTarget;

    @NotNull
    private Double angle;

    private String material;

    private Double range;

    public Double getRange() {
        return range;
    }

    public void setRange(Double range) {
        this.range = range;
    }


    // Getters and setters
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

    public Double getVelocity() {
        return velocity;
    }

    public void setVelocity(Double velocity) {
        this.velocity = velocity;
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
}
