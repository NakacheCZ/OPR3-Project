package com.calculator.repository;

import com.calculator.entity.SubCaliberPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCaliberPresetRepository extends JpaRepository<SubCaliberPreset, Long> {
    List<SubCaliberPreset> findByMaterial(String material);
    List<SubCaliberPreset> findByUserId(Long userId);
}
