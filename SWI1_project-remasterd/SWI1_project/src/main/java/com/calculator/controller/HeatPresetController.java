package com.calculator.controller;

import com.calculator.entity.HeatPreset;
import com.calculator.entity.User;
import com.calculator.repository.HeatPresetRepository;
import com.calculator.repository.UserRepository;
import com.calculator.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calculator/presets/heat")
@CrossOrigin(origins = "http://localhost:3000")
public class HeatPresetController {
    private final HeatPresetRepository repository;
    private final UserService userService;
    private final UserRepository userRepository;

    public HeatPresetController(HeatPresetRepository repository, UserService userService, UserRepository userRepository) {
        this.repository = repository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<HeatPreset>> getAllPresets(Authentication authentication) {
        if (authentication == null || authentication.getName().equals("guest")) {
            Optional<User> admin = userRepository.findByUsername("admin");
            if (admin.isPresent()) {
                return ResponseEntity.ok(repository.findByUserId(admin.get().getId()));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        Long userId = userService.getCurrentUserId();
        return ResponseEntity.ok(repository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<HeatPreset> createPreset(@RequestBody HeatPreset preset, Authentication authentication) {
        if (authentication.getName().equals("guest")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        preset.setUserId(userService.getCurrentUserId());
        HeatPreset savedPreset = repository.save(preset);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPreset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HeatPreset> updatePreset(@PathVariable Long id, @RequestBody HeatPreset preset, Authentication authentication) {
        if (authentication.getName().equals("guest")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return repository.findById(id)
                .map(existingPreset -> {
                    if (!existingPreset.getUserId().equals(userService.getCurrentUserId())) {
                        return new ResponseEntity<HeatPreset>(HttpStatus.FORBIDDEN);
                    }
                    preset.setId(id);
                    preset.setUserId(userService.getCurrentUserId());
                    HeatPreset updatedPreset = repository.save(preset);
                    return ResponseEntity.ok(updatedPreset);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePreset(@PathVariable Long id, Authentication authentication) {
        if (authentication.getName().equals("guest")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return repository.findById(id)
                .map(existingPreset -> {
                    if (!existingPreset.getUserId().equals(userService.getCurrentUserId())) {
                        return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
                    }
                    repository.deleteById(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
