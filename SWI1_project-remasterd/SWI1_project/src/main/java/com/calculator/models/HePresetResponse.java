package com.calculator.models;

public class HePresetResponse {
    private Long id;
    private String name;
    private String explosiveType;
    private Double diameter;
    private Double explosiveMass;

    public HePresetResponse(Long id, String name, String explosiveType, Double diameter, Double explosiveMass) {
        this.id = id;
        this.name = name;
        this.explosiveType = explosiveType;
        this.diameter = diameter;
        this.explosiveMass = explosiveMass;
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

    public String getExplosiveType() {
        return explosiveType;
    }

    public void setExplosiveType(String explosiveType) {
        this.explosiveType = explosiveType;
    }

    public Double getDiameter() {
        return diameter;
    }

    public void setDiameter(Double diameter) {
        this.diameter = diameter;
    }

    public Double getExplosiveMass() {
        return explosiveMass;
    }

    public void setExplosiveMass(Double explosiveMass) {
        this.explosiveMass = explosiveMass;
    }
}

