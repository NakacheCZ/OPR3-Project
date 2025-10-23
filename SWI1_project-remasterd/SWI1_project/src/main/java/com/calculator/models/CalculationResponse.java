package com.calculator.models;

public class CalculationResponse {
    private Double result;
    private String unit;
    private String calculationType;

    public CalculationResponse() {}

    public CalculationResponse(Double result, String unit, String calculationType) {
        this.result = result;
        this.unit = unit;
        this.calculationType = calculationType;
    }

    public Double getResult() {
        return result;
    }

    public void setResult(Double result) {
        this.result = result;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getCalculationType() {
        return calculationType;
    }

    public void setCalculationType(String calculationType) {
        this.calculationType = calculationType;
    }
}
