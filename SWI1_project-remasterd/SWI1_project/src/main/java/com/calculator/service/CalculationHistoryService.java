package com.calculator.service;

import com.calculator.repository.CalculationHistoryRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalculationHistoryService {

    private final CalculationHistoryRepository calculationHistoryRepository;

    // Vaše metody zde
}