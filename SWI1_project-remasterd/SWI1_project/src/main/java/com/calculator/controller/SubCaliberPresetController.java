package com.calculator.controller;

import com.calculator.entity.SubCaliberPreset;
import com.calculator.repository.SubCaliberPresetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/sub-caliber")
public class SubCaliberPresetController {
    private final SubCaliberPresetRepository repository;

    public SubCaliberPresetController(SubCaliberPresetRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<SubCaliberPreset>> getAllPresets() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<SubCaliberPreset> createPreset(@RequestBody SubCaliberPreset preset) {
        SubCaliberPreset savedPreset = repository.save(preset);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPreset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubCaliberPreset> updatePreset(@PathVariable Long id, @RequestBody SubCaliberPreset preset) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        preset.setId(id);
        SubCaliberPreset updatedPreset = repository.save(preset);
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