package com.calculator.config;

import com.calculator.entity.*;
import com.calculator.repository.*;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.csv-import.enabled:true}")
    private boolean csvImportEnabled;

    @PostConstruct
    @Transactional
    public void loadAllData() {
        if (!csvImportEnabled) {
            log.info("CSV import is disabled");
            return;
        }

        clearExistingData();

        try {
            log.info("Starting data import...");
            User adminUser = loadUsers();
            loadExplosiveTypes();
            loadFullCaliberPresets(adminUser);
            loadSubCaliberPresets(adminUser);
            loadHeatPresets(adminUser);
            loadHePresets(adminUser);
            log.info("Data import completed successfully");
        } catch (Exception e) {
            log.error("Error during data import", e);
        }
    }

    private void clearExistingData() {
        log.info("Clearing existing data from tables...");
        hePresetRepository.deleteAll();
        heatPresetRepository.deleteAll();
        fullCaliberPresetRepository.deleteAll();
        subCaliberPresetRepository.deleteAll();
        explosiveTypeRepository.deleteAll();
        userRepository.deleteAll();
        log.info("All existing data cleared successfully");
    }

    private User loadUsers() {
        log.info("Loading Users...");
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setAdmin(true);
        userRepository.save(admin);

        User guest = new User();
        guest.setUsername("guest");
        guest.setPassword(passwordEncoder.encode("guest"));
        guest.setAdmin(false);
        userRepository.save(guest);
        
        log.info("Users loaded.");
        return admin;
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

    private void loadFullCaliberPresets(User adminUser) throws IOException, CsvValidationException {
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
                    preset.setUserId(adminUser.getId());
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing Full Caliber preset: {}", String.join(",", line), e);
                }
            }
            fullCaliberPresetRepository.saveAll(presets);
            log.info("Loaded {} Full Caliber presets", presets.size());
        }
    }

    private void loadSubCaliberPresets(User adminUser) throws IOException, CsvValidationException {
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
                    preset.setUserId(adminUser.getId());
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing Sub-Caliber preset: {}", String.join(",", line), e);
                }
            }
            subCaliberPresetRepository.saveAll(presets);
            log.info("Loaded {} Sub-Caliber presets", presets.size());
        }
    }

    private void loadHeatPresets(User adminUser) throws IOException, CsvValidationException {
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
                    preset.setUserId(adminUser.getId());
                    presets.add(preset);
                } catch (Exception e) {
                    log.warn("Error parsing HEAT preset: {}", String.join(",", line), e);
                }
            }
            heatPresetRepository.saveAll(presets);
            log.info("Loaded {} HEAT presets", presets.size());
        }
    }

    private void loadHePresets(User adminUser) throws IOException, CsvValidationException {
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
                    preset.setUserId(adminUser.getId());
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
