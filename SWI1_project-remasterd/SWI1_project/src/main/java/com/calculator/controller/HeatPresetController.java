package com.calculator.controller;

import com.calculator.entity.HeatPreset;
import com.calculator.repository.HeatPresetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/heat")
@CrossOrigin(origins = "http://localhost:3000")
public class HeatPresetController {
    private final HeatPresetRepository repository;

    public HeatPresetController(HeatPresetRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<HeatPreset>> getAllPresets() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<HeatPreset> createPreset(@RequestBody HeatPreset preset) {
        HeatPreset savedPreset = repository.save(preset);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPreset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HeatPreset> updatePreset(@PathVariable Long id, @RequestBody HeatPreset preset) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        preset.setId(id);
        HeatPreset updatedPreset = repository.save(preset);
        return ResponseEntity.ok(updatedPreset);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePreset(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}