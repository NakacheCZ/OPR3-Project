package com.calculator.models;

import org.antlr.v4.runtime.misc.NotNull;

public class OverpressureRequest {
    private String explosiveType;

    @NotNull
    private Double explosiveMass;

    // Getters and setters
    public String getExplosiveType() {
        return explosiveType;
    }

    public void setExplosiveType(String explosiveType) {
        this.explosiveType = explosiveType;
    }

    public Double getExplosiveMass() {
        return explosiveMass;
    }

    public void setExplosiveMass(Double explosiveMass) {
        this.explosiveMass = explosiveMass;
    }
}
