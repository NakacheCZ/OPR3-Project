package com.calculator.service;

import com.calculator.entity.*;
import com.calculator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresetService {

    private final FullCaliberPresetRepository fullCaliberPresetRepository;
    private final SubCaliberPresetRepository subCaliberPresetRepository;
    private final HeatPresetRepository heatPresetRepository;
    private final HePresetRepository hePresetRepository;
    private final UserRepository userRepository;

    public void copyBasePresetsToUser(User user) {
        User admin = userRepository.findByUsername("admin").orElseThrow(() -> new RuntimeException("Admin user not found!"));

        // Copy Full Caliber Presets
        fullCaliberPresetRepository.findByUserId(admin.getId()).forEach(basePreset -> {
            FullCaliberPreset userPreset = new FullCaliberPreset();
            userPreset.setName(basePreset.getName());
            userPreset.setMass(basePreset.getMass());
            userPreset.setVelocity(basePreset.getVelocity());
            userPreset.setAngle(basePreset.getAngle());
            userPreset.setDiameter(basePreset.getDiameter());
            userPreset.setConstant(basePreset.getConstant());
            userPreset.setThicknessExponent(basePreset.getThicknessExponent());
            userPreset.setScaleExponent(basePreset.getScaleExponent());
            userPreset.setRange(basePreset.getRange());
            userPreset.setUserId(user.getId());
            fullCaliberPresetRepository.save(userPreset);
        });

        // Copy Sub-Caliber Presets
        subCaliberPresetRepository.findByUserId(admin.getId()).forEach(basePreset -> {
            SubCaliberPreset userPreset = new SubCaliberPreset();
            userPreset.setName(basePreset.getName());
            userPreset.setMaterial(basePreset.getMaterial());
            userPreset.setTotalLength(basePreset.getTotalLength());
            userPreset.setDiameter(basePreset.getDiameter());
            userPreset.setDensityPenetrator(basePreset.getDensityPenetrator());
            userPreset.setHardnessPenetrator(basePreset.getHardnessPenetrator());
            userPreset.setVelocity(basePreset.getVelocity());
            userPreset.setUserId(user.getId());
            subCaliberPresetRepository.save(userPreset);
        });

        // Copy HEAT Presets
        heatPresetRepository.findByUserId(admin.getId()).forEach(basePreset -> {
            HeatPreset userPreset = new HeatPreset();
            userPreset.setName(basePreset.getName());
            userPreset.setExplosiveType(basePreset.getExplosiveType());
            userPreset.setDiameter(basePreset.getDiameter());
            userPreset.setExplosiveMass(basePreset.getExplosiveMass());
            userPreset.setCoefficient(basePreset.getCoefficient());
            userPreset.setEfficiency(basePreset.getEfficiency());
            userPreset.setUserId(user.getId());
            heatPresetRepository.save(userPreset);
        });

        // Copy HE Presets
        hePresetRepository.findByUserId(admin.getId()).forEach(basePreset -> {
            HePreset userPreset = new HePreset();
            userPreset.setName(basePreset.getName());
            userPreset.setExplosiveType(basePreset.getExplosiveType());
            userPreset.setDiameter(basePreset.getDiameter());
            userPreset.setExplosiveMass(basePreset.getExplosiveMass());
            userPreset.setUserId(user.getId());
            hePresetRepository.save(userPreset);
        });
    }
}
