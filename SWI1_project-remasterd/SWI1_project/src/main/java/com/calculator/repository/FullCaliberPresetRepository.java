package com.calculator.repository;

import com.calculator.entity.FullCaliberPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FullCaliberPresetRepository extends JpaRepository<FullCaliberPreset, Long> {
    Optional<FullCaliberPreset> findByName(String name);

    List<FullCaliberPreset> findByNameContainingIgnoreCase(String name);

    List<FullCaliberPreset> findByUserId(Long userId);
}
