package com.calculator.repository;


import com.calculator.entity.ExplosiveType;
import com.calculator.entity.HePreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HePresetRepository extends JpaRepository<HePreset, Long> {
    @Query("SELECT h FROM HePreset h WHERE h.explosiveType = :type")
    List<HePreset> findByExplosiveType(@Param("type") ExplosiveType type);
    List<HePreset> findByNameContainingIgnoreCase(String name);
    List<HePreset> findByUserId(Long userId);

}
