package com.calculator.controller;

import com.calculator.entity.User;
import com.calculator.repository.*;
import com.calculator.service.PresetService;
import com.calculator.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/presets")
@CrossOrigin(origins = "http://localhost:3000")
public class PresetController {

    private final UserService userService;
    private final PresetService presetService;
    private final FullCaliberPresetRepository fullCaliberPresetRepository;
    private final SubCaliberPresetRepository subCaliberPresetRepository;
    private final HeatPresetRepository heatPresetRepository;
    private final HePresetRepository hePresetRepository;
    private final UserRepository userRepository;


    public PresetController(UserService userService, PresetService presetService, FullCaliberPresetRepository fullCaliberPresetRepository, SubCaliberPresetRepository subCaliberPresetRepository, HeatPresetRepository heatPresetRepository, HePresetRepository hePresetRepository, UserRepository userRepository) {
        this.userService = userService;
        this.presetService = presetService;
        this.fullCaliberPresetRepository = fullCaliberPresetRepository;
        this.subCaliberPresetRepository = subCaliberPresetRepository;
        this.heatPresetRepository = heatPresetRepository;
        this.hePresetRepository = hePresetRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetUserPresets(Authentication authentication) {
        String username = authentication.getName();
        if (username.equals("guest") || username.equals("admin")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Guests and admins cannot reset presets."));
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete existing user-specific presets
        fullCaliberPresetRepository.deleteAll(fullCaliberPresetRepository.findByUserId(user.getId()));
        subCaliberPresetRepository.deleteAll(subCaliberPresetRepository.findByUserId(user.getId()));
        heatPresetRepository.deleteAll(heatPresetRepository.findByUserId(user.getId()));
        hePresetRepository.deleteAll(hePresetRepository.findByUserId(user.getId()));

        // Copy base presets from admin
        presetService.copyBasePresetsToUser(user);

        return ResponseEntity.ok(Map.of("message", "Presets reset successfully."));
    }
}
