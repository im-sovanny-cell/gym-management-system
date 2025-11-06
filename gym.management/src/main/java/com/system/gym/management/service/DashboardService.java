// src/main/java/com/system/gym/management/service/DashboardService.java
package com.system.gym.management.service;

import com.system.gym.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepo;
    private final GymRepository gymRepo;
    private final TrainerRepository trainerRepo;
    private final PaymentRepository paymentRepo;

    public long countUsers() { return userRepo.count(); }
    public long countGyms() { return gymRepo.count(); }
    public long countTrainers() { return trainerRepo.count(); }

    public double getTodayTotal() {
        return paymentRepo.sumPaymentsByDate(LocalDate.now()).orElse(0.0);
    }

    public double getAllTimeTotal() {
        return paymentRepo.findAll().stream()
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
    }
}