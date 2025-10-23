package com.calculator.models;

public class ExplosiveTypeResponse {
    private Long id;
    private String name;
    private Double energyFactor;

    public ExplosiveTypeResponse(Long id, String name, Double energyFactor) {
        this.id = id;
        this.name = name;
        this.energyFactor = energyFactor;
    }

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

    public Double getEnergyFactor() {
        return energyFactor;
    }

    public void setEnergyFactor(Double energyFactor) {
        this.energyFactor = energyFactor;
    }
}

