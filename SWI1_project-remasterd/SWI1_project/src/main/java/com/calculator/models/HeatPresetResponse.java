package com.calculator.models;

public class HeatPresetResponse {
    private Long id;
    private String name;
    private String explosiveType;
    private Double diameter;
    private Double explosiveMass;
    private Double coefficient;
    private Double efficiency;

    public HeatPresetResponse(Long id, String name, String explosiveType, Double diameter, Double explosiveMass, Double coefficient, Double efficiency) {
        this.id = id;
        this.name = name;
        this.explosiveType = explosiveType;
        this.diameter = diameter;
        this.explosiveMass = explosiveMass;
        this.coefficient = coefficient;
        this.efficiency = efficiency;
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
}
