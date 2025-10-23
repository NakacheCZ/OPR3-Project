package com.calculator.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ArmorPenetrationCalculatorServiceTest {

    private final ArmorPenetrationCalculatorService service = new ArmorPenetrationCalculatorService();

    private boolean isWithinTolerance(double expected, double actual, double tolerancePercentage) {
        double tolerance = expected * (tolerancePercentage / 100);
        return actual >= (expected - tolerance) && actual <= (expected + tolerance);
    }

    @Test
    public void testCalculateFullCaliber() {
        double mass = 6.8;
        double velocity = 935;
        double angle = Math.toRadians(30);
        double diameter = 75;
        double materialCoefficient = 2000;
        double materialExponent = 1.15;
        double resistanceCoefficient = 0.1;
        double range = 0;

        double expected = 147.75; // Očekávaný výsledek //7.5cm KwK 42 (Panther) Panzergranate 39/42
        double actual = service.calculateFullCaliberWithVelocityLoss(mass, velocity, angle, diameter, materialCoefficient, materialExponent, resistanceCoefficient, range);

        assertTrue(isWithinTolerance(expected, actual, 5), "Výsledek není v toleranci 5 %");
    }

    @Test
    public void testCalculateSubCaliber() {
        double totalLength = 775;
        double diameter = 25.5;
        double velocity = 1.75;
        double densityPenetrator = 17500;
        double hardnessPenetrator = 237;
        double densityTarget = 7850;
        double hardnessTarget = 237;
        double angle = Math.toRadians(60);
        String material = "Tungsten";
        double range = 500.0;

        double expected = 415.05; // Očekávaný výsledek //3BM70 "Vacuum-2"
        double actual = service.calculateSubCaliberFinal(totalLength, diameter, velocity, densityPenetrator, hardnessPenetrator, densityTarget, hardnessTarget, angle, material, range);

        assertTrue(isWithinTolerance(expected, actual, 5), "Výsledek není v toleranci 5 %");
    }

    @Test
    public void testCalculateHEAT() {
        double diameter = 120;
        double coefficient = 12;
        double efficiency = 100;
        double angleOfImpact = Math.toRadians(0);

        double expected = 482.98; // Očekávaný výsledek //DM12A1
        double actual = service.calculateHEAT(diameter, coefficient, efficiency, angleOfImpact);

        assertTrue(isWithinTolerance(expected, actual, 5.0), "Výsledek není v toleranci 5 %");
    }

    @Test
    public void testCalculateHE() {
        String explosiveType = "Fp.02";
        double explosiveMass = 1;

        double expected = 13.89; // Očekávaný výsledek //Sprgr.43
        double actual = service.calculateOverpressure(explosiveType, explosiveMass);

        assertTrue(isWithinTolerance(expected, actual, 5.0), "Výsledek není v toleranci 5 %");
    }
}
