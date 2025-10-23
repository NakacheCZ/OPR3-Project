package com.calculator.repository;

import com.calculator.entity.ExplosiveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExplosiveTypeRepository extends JpaRepository<ExplosiveType, Long> {
    Optional<ExplosiveType> findByName(String name);
}