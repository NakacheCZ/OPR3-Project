package com.calculator.repository;

import com.calculator.entity.CalculationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculationHistoryRepository extends JpaRepository<CalculationHistory, Long> {
    boolean existsByCalculationType(String calculationType);
}