package com.calculator.models;

import org.antlr.v4.runtime.misc.NotNull;

public class MassCalculationRequest {
    @NotNull
    private Double totalLength;

    @NotNull
    private Double diameter;

    @NotNull
    private Double densityPenetrator;

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

    public Double getDensityPenetrator() {
        return densityPenetrator;
    }

    public void setDensityPenetrator(Double densityPenetrator) {
        this.densityPenetrator = densityPenetrator;
    }
}