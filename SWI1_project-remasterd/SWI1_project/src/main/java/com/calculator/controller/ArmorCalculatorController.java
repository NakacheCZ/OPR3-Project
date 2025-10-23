package com.calculator.controller;

import com.calculator.entity.CalculationHistory;
import com.calculator.entity.HePreset;
import com.calculator.entity.HeatPreset;
import com.calculator.models.*;
import com.calculator.repository.*;
import com.calculator.service.ArmorPenetrationCalculatorService;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calculator")
@Slf4j
public class ArmorCalculatorController {

    private final ArmorPenetrationCalculatorService calculatorService;
    private final CalculationHistoryRepository calculationHistoryRepository;
    private final FullCaliberPresetRepository fullCaliberPresetRepository;
    private final HeatPresetRepository heatPresetRepository;
    private final HePresetRepository hePresetRepository;
    private final ExplosiveTypeRepository explosiveTypeRepository;
    private final SubCaliberPresetRepository subCaliberPresetRepository;
    private Gson gson;

    @Autowired
    public ArmorCalculatorController(
            ArmorPenetrationCalculatorService calculatorService,
            CalculationHistoryRepository calculationHistoryRepository,
            FullCaliberPresetRepository fullCaliberPresetRepository,
            HeatPresetRepository heatPresetRepository,
            HePresetRepository hePresetRepository,
            ExplosiveTypeRepository explosiveTypeRepository,
            SubCaliberPresetRepository subCaliberPresetRepository) {
        this.calculatorService = calculatorService;
        this.calculationHistoryRepository = calculationHistoryRepository;
        this.fullCaliberPresetRepository = fullCaliberPresetRepository;
        this.heatPresetRepository = heatPresetRepository;
        this.hePresetRepository = hePresetRepository;
        this.explosiveTypeRepository = explosiveTypeRepository;
        this.subCaliberPresetRepository = subCaliberPresetRepository;
        this.gson = new Gson();
    }


    @PostMapping("/full-caliber")
    public ResponseEntity<CalculationResponse> calculateFullCaliber(@Valid @RequestBody FullCaliberRequest request) {
        double result = calculatorService.calculateFullCaliberWithVelocityLoss(
                request.getMass(),
                request.getVelocity(),
                request.getAngle(),
                request.getDiameter(),
                request.getMaterialCoefficient(),
                request.getMaterialExponent(),
                request.getResistanceCoefficient(),
                request.getRange()
        );

        return ResponseEntity.ok(new CalculationResponse(result, "mm", "Full Caliber Penetration"));
    }

    @PostMapping("/sub-caliber")
    public ResponseEntity<CalculationResponse> calculateSubCaliber(@Valid @RequestBody SubCaliberRequest request) {
        double result = calculatorService.calculateSubCaliberFinal(
                request.getTotalLength(),
                request.getDiameter(),
                request.getVelocity(),
                request.getDensityPenetrator(),
                request.getHardnessPenetrator(),
                request.getDensityTarget(),
                request.getHardnessTarget(),
                request.getAngle(),
                request.getMaterial(),
                request.getRange()
        );

        return ResponseEntity.ok(new CalculationResponse(result, "mm", "Sub-Caliber Penetration"));
    }


    @PostMapping("/velocity-loss")
    public ResponseEntity<CalculationResponse> calculateVelocityLoss(
            @Valid @RequestBody VelocityLossRequest request) {

        double result = calculatorService.calculateVelocityLoss(
                request.getInitialVelocity(),
                request.getMass(),
                request.getDiameter(),
                request.getDragCoefficient(),
                request.getAirDensity(),
                request.getDistance()
        );

        return ResponseEntity.ok(new CalculationResponse(result, "m/s", "Final Velocity"));
    }

    @PostMapping("/heat")
    public ResponseEntity<CalculationResponse> calculateHEAT(@Valid @RequestBody HEATRequest request) {
        try {
            log.info("HEAT calculation request received. Raw body: {}", gson.toJson(request));

            // Validace vstupních dat
            if (request == null) {
                log.error("HEAT request is null");
                return ResponseEntity.badRequest().body(new CalculationResponse(0.0, "mm", "Error: Request is null"));
            }

            log.info("Parsed values - diameter: {}, coefficient: {}, efficiency: {}, angleOfImpact: {}",
                    request.getDiameter(),
                    request.getCoefficient(),
                    request.getEfficiency(),
                    request.getAngleOfImpact());


            // Kontrola jednotlivých polí
            if (request.getDiameter() == null || request.getDiameter() <= 0) {
                log.error("Invalid diameter: {}", request.getDiameter());
                return ResponseEntity.badRequest().body(new CalculationResponse(0.0, "mm", "Error: Invalid diameter"));
            }
            if (request.getCoefficient() == null || request.getCoefficient() <= 0) {
                log.error("Invalid coefficient: {}", request.getCoefficient());
                return ResponseEntity.badRequest().body(new CalculationResponse(0.0, "mm", "Error: Invalid coefficient"));
            }
            if (request.getEfficiency() == null || request.getEfficiency() <= 0 || request.getEfficiency() > 100) {
                log.error("Invalid efficiency: {}", request.getEfficiency());
                return ResponseEntity.badRequest().body(new CalculationResponse(0.0, "mm", "Error: Invalid efficiency (should be between 0 and 100)"));
            }
            if (request.getAngleOfImpact() == null) {
                log.error("Invalid angle of impact: {}", request.getAngleOfImpact());
                return ResponseEntity.badRequest().body(new CalculationResponse(0.0, "mm", "Error: Invalid angle of impact"));
            }

            double result = calculatorService.calculateHEAT(
                    request.getDiameter(),
                    request.getCoefficient(),
                    request.getEfficiency(),
                    request.getAngleOfImpact()
            );

            log.info("HEAT calculation successful. Result: {}", result);
            return ResponseEntity.ok(new CalculationResponse(result, "mm", "HEAT Penetration"));
        } catch (Exception e) {
            log.error("Error during HEAT calculation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CalculationResponse(0.0, "mm", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/he")
    public ResponseEntity<CalculationResponse> calculateHE(@RequestBody OverpressureRequest request) {
        double result = calculatorService.calculateOverpressure(
                request.getExplosiveType(),
                request.getExplosiveMass()
        );

        return ResponseEntity.ok(new CalculationResponse(result, "mm", "HE Overpressure"));
    }



    @PostMapping("/overpressure")
    public ResponseEntity<CalculationResponse> calculateOverpressure(
            @Valid @RequestBody OverpressureRequest request) {

        double result = calculatorService.calculateOverpressure(
                request.getExplosiveType(),
                request.getExplosiveMass()
        );

        return ResponseEntity.ok(new CalculationResponse(result, "mm", "Overpressure Penetration"));
    }

    @PostMapping("/mass")
    public ResponseEntity<CalculationResponse> calculateMass(
            @Valid @RequestBody MassCalculationRequest request) {

        double result = calculatorService.calculateMass(
                request.getTotalLength(),
                request.getDiameter(),
                request.getDensityPenetrator()
        );

        return ResponseEntity.ok(new CalculationResponse(result, "kg", "Penetrator Mass"));
    }

    @GetMapping("/full-caliber-presets")
    public ResponseEntity<List<FullCaliberPresetResponse>> getFullCaliberPresets() {
        List<FullCaliberPresetResponse> presets = fullCaliberPresetRepository.findAll()
                .stream()
                .map(preset -> new FullCaliberPresetResponse(
                        preset.getId(),
                        preset.getName(),
                        preset.getMass(),
                        preset.getVelocity(),
                        preset.getDiameter(),
                        preset.getRange(),
                        Math.toDegrees(preset.getAngle()), // Převod úhlu na stupně
                        preset.getConstant(),
                        preset.getThicknessExponent(),
                        preset.getScaleExponent()
                ))
                .toList();

        return ResponseEntity.ok(presets);
    }
    @GetMapping("/sub-caliber-presets")
    public ResponseEntity<List<SubCaliberPresetResponse>> getSubCaliberPresets() {
        List<SubCaliberPresetResponse> presets = subCaliberPresetRepository.findAll()
                .stream()
                .map(preset -> new SubCaliberPresetResponse(
                        preset.getId(),
                        preset.getName(),
                        preset.getTotalLength(),
                        preset.getDiameter(),
                        preset.getDensityPenetrator(),
                        preset.getHardnessPenetrator(),
                        preset.getVelocity(),
                        preset.getDensityTarget(),
                        preset.getHardnessTarget(),
                        preset.getAngle(),
                        preset.getMaterial(),
                        preset.getRange()
                ))
                .toList();

        return ResponseEntity.ok(presets);
    }
    @GetMapping("/heat-presets")
    public ResponseEntity<List<HeatPresetResponse>> getHeatPresets() {
        List<HeatPresetResponse> presets = heatPresetRepository.findAll()
                .stream()
                .map(preset -> new HeatPresetResponse(
                        preset.getId(),
                        preset.getName(),
                        preset.getExplosiveType().getName(),
                        preset.getDiameter(),
                        preset.getExplosiveMass(),
                        preset.getCoefficient(),
                        preset.getEfficiency()
                ))
                .toList();

        return ResponseEntity.ok(presets);
    }

    @GetMapping("/he-presets")
    public ResponseEntity<List<HePresetResponse>> getHePresets() {
        List<HePresetResponse> presets = hePresetRepository.findAll()
                .stream()
                .map(preset -> new HePresetResponse(
                        preset.getId(),
                        preset.getName(),
                        preset.getExplosiveType().getName(),
                        preset.getDiameter(),
                        preset.getExplosiveMass()
                ))
                .toList();

        return ResponseEntity.ok(presets);
    }
@GetMapping("/explosive-types")
public ResponseEntity<List<ExplosiveTypeResponse>> getExplosiveTypes() {
    List<ExplosiveTypeResponse> explosiveTypes = explosiveTypeRepository.findAll()
        .stream()
        .map(type -> new ExplosiveTypeResponse(
            type.getId(),
            type.getName(),
            type.getEnergyFactor()
        ))
        .collect(Collectors.toList());

    return ResponseEntity.ok(explosiveTypes);
}




    @PostMapping("/save-calculation-history")
    public ResponseEntity<String> saveCalculationHistory(@RequestBody CalculationHistory history) {
        calculationHistoryRepository.save(history);
        return ResponseEntity.ok("History saved successfully.");
    }
    @GetMapping("/calculation-history")
    public ResponseEntity<List<CalculationHistory>> getCalculationHistory() {
        List<CalculationHistory> history = calculationHistoryRepository.findAll();
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/calculation-history/{id}")
    public ResponseEntity<Void> deleteCalculationHistory(@PathVariable Long id) {
        if (calculationHistoryRepository.existsById(id)) {
            calculationHistoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}