package com.calculator.controller;

import com.calculator.entity.HePreset;
import com.calculator.repository.HePresetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/he")
@CrossOrigin(origins = "http://localhost:3000")
public class HePresetController {
    private final HePresetRepository repository;

    public HePresetController(HePresetRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<HePreset>> getAllPresets() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<HePreset> createPreset(@RequestBody HePreset preset) {
        HePreset savedPreset = repository.save(preset);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPreset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HePreset> updatePreset(@PathVariable Long id, @RequestBody HePreset preset) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        preset.setId(id);
        HePreset updatedPreset = repository.save(preset);
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