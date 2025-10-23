package com.calculator.models;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Max;

public class HEATRequest {
    @NotNull(message = "Diameter is required")
    @Positive(message = "Diameter must be positive")
    private Double diameter;

    @NotNull(message = "Coefficient is required")
    @Positive(message = "Coefficient must be positive")
    private Double coefficient;

    @NotNull(message = "Efficiency is required")
    @Positive(message = "Efficiency must be positive")
    @Max(value = 100, message = "Efficiency cannot be greater than 100")
    private Double efficiency;

    @NotNull(message = "Angle of impact is required")
    private Double angleOfImpact;

    public Double getDiameter() {
        return diameter;
    }

    public void setDiameter(Double diameter) {
        this.diameter = diameter;
    }

    public Double getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(Double coefficient) {
        this.coefficient = coefficient;
    }

    public Double getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(Double efficiency) {
        this.efficiency = efficiency;
    }

    public Double getAngleOfImpact() {
        return angleOfImpact;
    }

    public void setAngleOfImpact(Double angleOfImpact) {
        this.angleOfImpact = angleOfImpact;
    }

    @Override
    public String toString() {
        return "HEATRequest{" +
                "diameter=" + diameter +
                ", coefficient=" + coefficient +
                ", efficiency=" + efficiency +
                ", angleOfImpact=" + angleOfImpact +
                '}';
    }
}
