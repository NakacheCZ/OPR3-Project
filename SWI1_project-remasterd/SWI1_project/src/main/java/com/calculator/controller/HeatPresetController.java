package com.calculator.controller;

import com.calculator.entity.HeatPreset;
import com.calculator.repository.HeatPresetRepository;
import com.calculator.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/heat")
@CrossOrigin(origins = "http://localhost:3000")
public class HeatPresetController {
    private final HeatPresetRepository repository;
    private final UserService userService;

    public HeatPresetController(HeatPresetRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<HeatPreset>> getAllPresets() {
        Long userId = userService.getCurrentUserId();
        List<HeatPreset> presets = repository.findByUserId(userId);
        presets.addAll(repository.findByUserId(null)); // Add base presets
        return ResponseEntity.ok(presets);
    }

    @PostMapping
    public ResponseEntity<HeatPreset> createPreset(@RequestBody HeatPreset preset) {
        preset.setUserId(userService.getCurrentUserId());
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
