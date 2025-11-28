package com.calculator.controller;

import com.calculator.entity.HePreset;
import com.calculator.repository.HePresetRepository;
import com.calculator.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/he")
@CrossOrigin(origins = "http://localhost:3000")
public class HePresetController {
    private final HePresetRepository repository;
    private final UserService userService;

    public HePresetController(HePresetRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<HePreset>> getAllPresets() {
        Long userId = userService.getCurrentUserId();
        List<HePreset> presets = repository.findByUserId(userId);
        presets.addAll(repository.findByUserId(null)); // Add base presets
        return ResponseEntity.ok(presets);
    }

    @PostMapping
    public ResponseEntity<HePreset> createPreset(@RequestBody HePreset preset) {
        preset.setUserId(userService.getCurrentUserId());
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
