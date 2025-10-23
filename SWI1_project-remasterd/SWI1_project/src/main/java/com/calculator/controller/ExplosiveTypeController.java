package com.calculator.controller;

import com.calculator.entity.ExplosiveType;
import com.calculator.repository.ExplosiveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/explosive-types")
public class ExplosiveTypeController {

    private final ExplosiveTypeRepository explosiveTypeRepository;


    @Autowired
    public ExplosiveTypeController(ExplosiveTypeRepository explosiveTypeRepository) {
        this.explosiveTypeRepository = explosiveTypeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ExplosiveType>> getAllExplosiveTypes() {
        return ResponseEntity.ok(explosiveTypeRepository.findAll());
    }


}
