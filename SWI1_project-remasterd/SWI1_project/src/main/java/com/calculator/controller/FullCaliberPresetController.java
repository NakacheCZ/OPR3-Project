package com.calculator.controller;

import com.calculator.entity.FullCaliberPreset;
import com.calculator.repository.FullCaliberPresetRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator/presets/full-caliber")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class FullCaliberPresetController {
    private final FullCaliberPresetRepository repository;

    public FullCaliberPresetController(FullCaliberPresetRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<FullCaliberPreset>> getAllPresets() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<FullCaliberPreset> createPreset(@RequestBody FullCaliberPreset preset) {
        try {
            log.info("Received preset data: {}", preset); // Přidejte logging
            if (preset.getName() == null || preset.getName().trim().isEmpty()) {
                log.warn("Missing preset name");
                return ResponseEntity.badRequest().build();
            }
            FullCaliberPreset savedPreset = repository.save(preset);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPreset);
        } catch (Exception e) {
            log.error("Error creating preset", e); // Logování chyby
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }



    @GetMapping("/search")
    public ResponseEntity<List<FullCaliberPreset>> searchPresets(@RequestParam String name) {
        return ResponseEntity.ok(repository.findByNameContainingIgnoreCase(name));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FullCaliberPreset> updatePreset(@PathVariable Long id, @RequestBody FullCaliberPreset preset) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        preset.setId(id);
        FullCaliberPreset updatedPreset = repository.save(preset);
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