package com.calculator.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class ArmorPenetrationCalculatorService {

    /**
     * Calculate penetration for full caliber projectiles
     *
     * @param m Mass in kg
     * @param v Velocity in m/s
     * @param theta Angle in radians
     * @param d Diameter in mm
     * @param k Material coefficient
     * @param n Material exponent
     * @param s Resistance coefficient
     * @return Penetration depth in mm
     */
    public double calculateFullCaliberWithVelocityLoss(double m, double v, double theta, double d, double k, double n, double s, double range) {
        double finalVelocity = calculateVelocityLoss(v, m, d *0.001, 0.30, 1.225, range);

        return calculateFullCaliber(m, finalVelocity, theta, d, k, n, s);
    }
    public double calculateFullCaliber(double m, double v, double theta, double d, double k, double n, double s) {
        d = d / 1000; // Convert mm to m
        double cosTheta = Math.cos(theta);
        double numerator = m * (v * Math.pow(cosTheta, 2));
        double denominator = Math.pow(k, 2) * Math.pow(d, 2.9);
        double ratio = numerator / denominator;
        double result = d * Math.pow(ratio, 1.0 / n);

        return result * 1000; // Convert back to mm
    }

    /**
     * Asynchronous calculation for full caliber projectiles
     */
    public CompletableFuture<Double> calculateFullCaliberAsync(double m, double v, double theta, double d, double k, double n, double s) {
        return CompletableFuture.supplyAsync(() ->
                Math.round(calculateFullCaliber(m, v, theta, d, k, n, s) * 100.0) / 100.0
        );
    }

    /**
     * Calculate velocity loss due to air resistance
     *
     * @param initialVelocity Initial velocity in m/s
     * @param mass Mass in kg
     * @param diameter Diameter in m
     * @param dragCoefficient Drag coefficient
     * @param airDensity Air density in kg/m³
     * @param distance Distance in m
     * @return Final velocity in m/s
     */
    public double calculateVelocityLoss(double initialVelocity, double mass, double diameter,
                                        double dragCoefficient, double airDensity, double distance) {
        double crossSectionalArea = Math.PI * Math.pow(diameter / 2.0, 2);
        double finalVelocity = initialVelocity;
        double stepSize = 1.0;
        double traveledDistance = 0.0;

        while (traveledDistance < distance && finalVelocity > 0) {
            double dragForce = 1 * dragCoefficient * crossSectionalArea * airDensity * Math.pow(finalVelocity, 2);
            double acceleration = dragForce / mass;
            finalVelocity -= acceleration * (stepSize / finalVelocity);
            finalVelocity = Math.max(finalVelocity, 0);
            traveledDistance += stepSize;
        }

        return finalVelocity;
    }

    /**
     * Calculate penetration for sub-caliber projectiles
     */
    public double calculateSubCaliberFinal(double totalLength, double diameter, double velocity,
                                           double densityPenetrator, double hardnessPenetrator,
                                           double densityTarget, double hardnessTarget,
                                           double angle, String material, double range) {

        // Validace vstupů
        if (totalLength <= 0 || diameter <= 0 || velocity <= 0 || densityPenetrator <= 0 ||
                hardnessPenetrator <= 0 || densityTarget <= 0 || hardnessTarget <= 0 || range < 0) {
            throw new IllegalArgumentException("Vstupní hodnoty musí být kladné a nenulové.");
        }
        if (angle < 0 || angle > 90) {
            throw new IllegalArgumentException("Úhel musí být v rozsahu 0–90 stupňů.");
        }
            log.info("Inputs - totalLength: {}, diameter: {}, velocity: {}, densityPenetrator: {}, hardnessPenetrator: {}, densityTarget: {}, hardnessTarget: {}, angle: {}, material: {}, range: {}",
                    totalLength, diameter, velocity, densityPenetrator, hardnessPenetrator, densityTarget, hardnessTarget, angle, material, range);

            double mass = calculateMass(totalLength, diameter, densityPenetrator);
        double finalVelocity = calculateVelocityLoss(velocity, mass, diameter * 0.001, 0.30, 1.225, range);
        if (Double.isNaN(mass) || Double.isNaN(finalVelocity)) {
            throw new ArithmeticException("Mezivýsledek je neplatný (NaN nebo Infinity).");
        }

        double result = calculateSubCaliber(totalLength, diameter, finalVelocity, densityPenetrator,
                hardnessPenetrator, densityTarget, hardnessTarget, angle, material);

        if (Double.isNaN(result)) {
            log.error("Výsledek je NaN. Zkontrolujte vstupní hodnoty a výpočet.");
            throw new ArithmeticException("Výsledek výpočtu je neplatný (NaN).");
        }
        return result;
    }
    public double calculateSubCaliber(double totalLength, double diameter, double velocity,
                                      double densityPenetrator, double hardnessPenetrator,
                                      double densityTarget, double hardnessTarget,
                                      double angle, String material) {
        double b0 = 0.283;
        double b1 = 0.0656;
        double m = 0.224;
        double s = 0;
        double a = 0;
        double correctionFactor = 1.0;

        if ("Tungsten".equals(material)) {
            a = 0.994;
            double c0 = 134.5;
            double c1 = -0.148;
            hardnessPenetrator = 294;
            s = ((c0 + c1 * hardnessTarget) * hardnessTarget) / densityPenetrator;
        } else if ("DU".equals(material)) {
            correctionFactor = 1.05;
            a = 0.825;
            double c0 = 90;
            double c1 = -0.0849;
            hardnessPenetrator = 330;
            s = ((c0 + c1 * hardnessTarget) * hardnessTarget) / densityPenetrator;
        } else if ("Steel".equals(material)) {
            correctionFactor = 0.5;
            a = 1.104;
            double c0 = 9874;
            double k = 0.3589;
            double n = -0.2342;
            s = (c0 * Math.pow(hardnessTarget, k) * Math.pow(hardnessPenetrator, n)) / densityPenetrator;
        }

        double velocitySquared = Math.pow(velocity, 2);
        double e = velocitySquared > 0 ? Math.exp(-s / velocitySquared) : 0;

        double hardnessRatio = Math.sqrt(hardnessPenetrator / hardnessTarget);
        double cosTheta = Math.pow(Math.cos(angle), m);
        double main = 1 / Math.tanh(b0 + b1 * (totalLength / diameter));

        double angleCorrectionFactor = calculateCorrectionFactor(angle);

        double normalizedPenetration = a * main * cosTheta * hardnessRatio * e * correctionFactor * angleCorrectionFactor * 1.325;

        return totalLength * normalizedPenetration;
    }

    /**
     * Asynchronous calculation for sub-caliber projectiles
     */
    public CompletableFuture<Double> calculateSubCaliberAsync(double totalLength, double diameter, double velocity,
                                                              double densityPenetrator, double hardnessPenetrator,
                                                              double densityTarget, double hardnessTarget,
                                                              double angle, String material) {
        return CompletableFuture.supplyAsync(() ->
                Math.round(calculateSubCaliber(totalLength, diameter, velocity, densityPenetrator,
                        hardnessPenetrator, densityTarget, hardnessTarget, angle, material) * 100.0) / 100.0
        );
    }

    /**
     * Calculate mass of penetrator based on dimensions and density
     */
    public double calculateMass(double totalLength, double diameter, double densityPenetrator) {
        totalLength = totalLength / 1000; // Convert to meters
        diameter = diameter / 1000; // Convert to meters
        double volume = Math.PI * Math.pow(diameter / 2, 2) * totalLength;
        return volume * densityPenetrator;
    }

    /**
     * Calculate correction factor based on angle
     */
    private double calculateCorrectionFactor(double angle) {
        double angleInDegrees = angle * (180.0 / Math.PI);

        double correctionAt0 = 1.0;
        double correctionAt30 = 0.85;
        double correctionAt60 = 0.66;
        double correctionAt90 = 0.0;

        if (angleInDegrees < 30) {
            return correctionAt0 - (correctionAt0 - correctionAt30) * (angleInDegrees / 30);
        } else if (angleInDegrees < 60) {
            return correctionAt30 - (correctionAt30 - correctionAt60) * ((angleInDegrees - 30) / 30);
        } else if (angleInDegrees < 90) {
            return correctionAt60 - (correctionAt60 - correctionAt90) * ((angleInDegrees - 60) / 30);
        } else {
            return 0.0;
        }
    }

    /**
     * Calculate HEAT (High Explosive Anti-Tank) penetration
     */
    public double calculateHEAT(double diameter, double coefficient, double efficiency, double angleOfImpact) {
        efficiency = efficiency / 100;
        double jetDensity = 8900;
        double targetDensity = 7850;
        double targetCoefficient = 0.315;
        double angleCoefficient = Math.cos(angleOfImpact);

        double materialCoefficient = Math.pow((jetDensity / targetDensity), 0.5);
        double penetration = diameter * coefficient * targetCoefficient * materialCoefficient;

        return Math.round((penetration * angleCoefficient * efficiency) * 100.0) / 100.0;
    }

    /**
     * Asynchronous calculation for HEAT projectiles
     */
    public CompletableFuture<Double> calculateHEATAsync(double diameter, double coefficient, double efficiency, double angleOfImpact) {
        return CompletableFuture.supplyAsync(() -> calculateHEAT(diameter, coefficient, efficiency, angleOfImpact));
    }

    /**
     * Calculate overpressure penetration
     */
    public double calculateOverpressure(String explosiveType, double explosiveMass) {
        double tntEquivalentMass = explosiveMass * getExplosiveEnergy(explosiveType);
        return calculatePenetrationDepth(tntEquivalentMass);
    }

    /**
     * Get explosive energy relative to TNT
     */
    private double getExplosiveEnergy(String explosiveType) {
        switch (explosiveType) {
            case "TNT":
                return 1.0;
            case "Explosive D":
                return 0.98;
            case "Composition A":
                return 1.44;
            case "Composition B":
                return 1.31;
            case "Fp.02":
                return 1.0;
            case "Amatol":
                return 1.0;
            case "Fp.60/40":
                return 1.0;
            case "H.5":
                return 1.7;
            case "H.10":
                return 1.7;
            case "Np.10":
                return 1.7;
            case "HTA":
                return 1.2;
            case "LX-14":
                return 1.4;
            case "PETN":
                return 1.7;
            case "A-IX-1":
                return 1.25;
            case "A-IX-2":
                return 1.54;
            case "Hexal":
                return 1.7;
            case "Octol":
                return 1.59;
            case "OKFOLl":
                return 1.62;
            default:
                throw new IllegalArgumentException("Unknown explosive type: " + explosiveType);
        }
    }

    /**
     * Calculate penetration depth based on TNT equivalent mass
     */
    private double calculatePenetrationDepth(double tntEquivalentMass) {
        for (int i = 0; i < PENETRATION_DATA.length - 1; i++) {
            if (tntEquivalentMass >= PENETRATION_DATA[i][0] && tntEquivalentMass <= PENETRATION_DATA[i + 1][0]) {
                double x0 = PENETRATION_DATA[i][0];
                double y0 = PENETRATION_DATA[i][1];
                double x1 = PENETRATION_DATA[i + 1][0];
                double y1 = PENETRATION_DATA[i + 1][1];

                return y0 + (y1 - y0) * ((tntEquivalentMass - x0) / (x1 - x0));
            }
        }

        if (tntEquivalentMass > PENETRATION_DATA[PENETRATION_DATA.length - 1][0]) {
            return PENETRATION_DATA[PENETRATION_DATA.length - 1][1];
        }

        return PENETRATION_DATA[0][1];
    }

    // TNT equivalent mass to penetration depth mapping
    private static final double[][] PENETRATION_DATA = {
            {0, 0},
            {0.005, 2.0},
            {0.1, 4.0},
            {0.2, 5.0},
            {2.0, 25.0},
            {3.0, 35.0},
            {5.0, 40.0},
            {6.0, 50.0},
            {8.0, 60.0},
            {9.0, 61.0},
            {10.0, 62.0},
            {11.0, 63.0},
            {25.0, 65.0},
            {40.0, 70.0},
            {120.0, 82.0},
            {300.0, 96.0},
            {500.0, 111.0},
            {700.0, 127.0},
            {1500.0, 191.0},
            {3500.0, 320.0},
            {5000.0, 350.0},
            {6000.0, 365.0}
    };
}
