package com.calculator.controller;

import com.calculator.entity.SubCaliberPreset;
import com.calculator.repository.SubCaliberPresetRepository;
import com.calculator.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/sub-caliber")
@CrossOrigin(origins = "http://localhost:3000")
public class SubCaliberPresetController {
    private final SubCaliberPresetRepository repository;
    private final UserService userService;

    public SubCaliberPresetController(SubCaliberPresetRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<SubCaliberPreset>> getAllPresets() {
        Long userId = userService.getCurrentUserId();
        List<SubCaliberPreset> presets = repository.findByUserId(userId);
        presets.addAll(repository.findByUserId(null)); // Add base presets
        return ResponseEntity.ok(presets);
    }

    @PostMapping
    public ResponseEntity<SubCaliberPreset> createPreset(@RequestBody SubCaliberPreset preset) {
        preset.setUserId(userService.getCurrentUserId());
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
