package com.calculator.repository;

import com.calculator.entity.HeatPreset;
import com.calculator.entity.ExplosiveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeatPresetRepository extends JpaRepository<HeatPreset, Long> {
    List<HeatPreset> findByNameContainingIgnoreCase(String name);
    List<HeatPreset> findByExplosiveType(ExplosiveType explosiveType);

}