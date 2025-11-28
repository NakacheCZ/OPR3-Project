package com.calculator.config;

import com.calculator.entity.*;
import com.calculator.repository.*;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CsvDataLoader {

    private final ExplosiveTypeRepository explosiveTypeRepository;
    private final FullCaliberPresetRepository fullCaliberPresetRepository;
    private final SubCaliberPresetRepository subCaliberPresetRepository;
    private final HeatPresetRepository heatPresetRepository;
    private final HePresetRepository hePresetRepository;
    private final RoleRepository roleRepository;

    @Value("${app.csv-import.enabled:true}")
    private boolean csvImportEnabled;

    @PostConstruct
    public void loadAllData() {
        if (!csvImportEnabled) {
            log.info("CSV import is disabled");
            return;
        }

        clearExistingData();


        try {

            log.info("Starting CSV data import...");
            loadRoles();
            loadExplosiveTypes();
            loadFullCaliberPresets();
            loadSubCaliberPresets();
            loadHeatPresets();
            loadHePresets();
            log.info("CSV data import completed successfully");
        } catch (Exception e) {
            log.error("Error during CSV data import", e);
        }
    }

    private void clearExistingData() {
        log.info("Clearing existing data from tables...");
        try {
            // Nejprve smažeme presety, které mají závislosti na explosive types
            hePresetRepository.deleteAll();
            heatPresetRepository.deleteAll();

            // Pak smažeme ostatní presety
            fullCaliberPresetRepository.deleteAll();
            subCaliberPresetRepository.deleteAll();

            // Nakonec smažeme explosive types
            explosiveTypeRepository.deleteAll();

            log.info("All existing data cleared successfully");
        } catch (Exception e) {
            log.error("Error while clearing existing data", e);
            throw e; // Přehodíme výjimku, aby se zastavilo načítání nových dat
        }
    }

    private void loadRoles() {
        log.info("Loading Roles...");
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }
        log.info("Roles loaded.");
    }


    private void loadExplosiveTypes() throws IOException, CsvValidationException {
        log.info("Loading Explosive Types...");
        ClassPathResource resource = new ClassPathResource("data/ExplosiveTypes.csv");

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            reader.readNext(); // Skip header
            String[] line;
            List<ExplosiveType> explosiveTypes = new ArrayList<>();

            while ((line = reader.readNext()) != null) {
                try {
                    ExplosiveType explosiveType = new ExplosiveType();
                    explosiveType.setName(line[0]);
                    explosiveType.setEnergyFactor(Double.parseDouble(line[1]));
                    explosiveTypes.add(explosiveType);
                } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                    log.warn("Error parsing line: {}", String.join(",", line), e);
                }
            }

            explosiveTypeRepository.saveAll(explosiveTypes);
            log.info("Loaded {} Explosive Types", explosiveTypes.size());
        }
    }

    private void loadFullCaliberPresets() throws IOException, CsvValidationException {
        log.info("Loading Full Caliber presets...");
        ClassPathResource resource = new ClassPathResource("data/FullCaliberShellPresets.csv");
        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            reader.readNext(); // Skip header
            List<FullCaliberPreset> presets = new ArrayList<>();
            String[] line;
            while ((line = reader.readNext()) != null) {
                try {
                    FullCaliberPreset preset = new FullCaliberPreset();
                    preset.setName(line[0]);
                    preset.setMass(Double.parseDouble(line[1]));
                    preset.setVelocity(Double.parseDouble(line[2]));
                    preset.setAngle(Math.toRadians(Double.parseDouble(line[3])));
                    preset.setDiameter(Double.parseDouble(line[4]));
                    preset.setConstant(Double.parseDouble(line[5]));
                    preset.setThicknessExponent(Double.parseDouble(line[6]));
                    preset.setScaleExponent(Double.parseDouble(line[7]));
                    preset.setRange(Double.parseDouble(line[8]));
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing Full Caliber preset: {}", String.join(",", line), e);
                }
            }
            fullCaliberPresetRepository.saveAll(presets);
            log.info("Loaded {} Full Caliber presets", presets.size());
        }
    }

    private void loadSubCaliberPresets() throws IOException, CsvValidationException {
        log.info("Loading Sub-Caliber presets...");
        ClassPathResource resource = new ClassPathResource("data/SubCaliberShellPresets.csv");
        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            reader.readNext(); // Skip header
            List<SubCaliberPreset> presets = new ArrayList<>();
            String[] line;
            while ((line = reader.readNext()) != null) {
                try {
                    SubCaliberPreset preset = new SubCaliberPreset();
                    preset.setName(line[0]);
                    preset.setMaterial(line[1]);
                    preset.setTotalLength(Double.parseDouble(line[2]));
                    preset.setDiameter(Double.parseDouble(line[3]));
                    preset.setDensityPenetrator(Double.parseDouble(line[4]));
                    preset.setHardnessPenetrator(Double.parseDouble(line[5]));
                    preset.setVelocity(Double.parseDouble(line[6]));
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing Sub-Caliber preset: {}", String.join(",", line), e);
                }
            }
            subCaliberPresetRepository.saveAll(presets);
            log.info("Loaded {} Sub-Caliber presets", presets.size());
        }
    }

    private void loadHeatPresets() throws IOException, CsvValidationException {
        log.info("Loading HEAT presets...");
        ClassPathResource resource = new ClassPathResource("data/HEATShellPresets.csv");
        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            reader.readNext(); // Skip header
            List<HeatPreset> presets = new ArrayList<>();
            String[] line;
            while ((line = reader.readNext()) != null) {
                try {
                    HeatPreset preset = new HeatPreset();
                    preset.setName(line[0]);
                    String explosiveTypeName = line[1];
                    ExplosiveType explosiveType = explosiveTypeRepository.findByName(explosiveTypeName)
                            .orElse(null);
                    if (explosiveType == null) {
                        log.warn("Unknown explosive type: {}", explosiveTypeName);
                        continue;
                    }
                    preset.setExplosiveType(explosiveType);
                    preset.setDiameter(Double.parseDouble(line[2]));
                    preset.setExplosiveMass(Double.parseDouble(line[3]));
                    preset.setCoefficient(Double.parseDouble(line[4]));
                    preset.setEfficiency(Double.parseDouble(line[5]));
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing HEAT preset: {}", String.join(",", line), e);
                }
            }
            heatPresetRepository.saveAll(presets);
            log.info("Loaded {} HEAT presets", presets.size());
        }
    }

    private void loadHePresets() throws IOException, CsvValidationException {
        log.info("Loading HE presets...");
        ClassPathResource resource = new ClassPathResource("data/HEShellPresets.csv");
        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            reader.readNext(); // Skip header
            List<HePreset> presets = new ArrayList<>();
            String[] line;
            while ((line = reader.readNext()) != null) {
                try {
                    HePreset preset = new HePreset();
                    preset.setName(line[0]);
                    String explosiveTypeName = line[1];
                    ExplosiveType explosiveType = explosiveTypeRepository.findByName(explosiveTypeName)
                            .orElse(null);
                    if (explosiveType == null) {
                        log.warn("Unknown explosive type: {}", explosiveTypeName);
                        continue;
                    }
                    preset.setExplosiveType(explosiveType);
                    preset.setDiameter(Double.parseDouble(line[2]));
                    preset.setExplosiveMass(Double.parseDouble(line[3]));
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing HE preset: {}", String.join(",", line), e);
                }
            }
            hePresetRepository.saveAll(presets);
            log.info("Loaded {} HE presets", presets.size());
        }
    }
}
