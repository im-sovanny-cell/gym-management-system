// src/main/java/com/system/gym/management/controller/DashboardController.java
package com.system.gym.management.controller;

import com.system.gym.management.dto.ClassSummaryDTO;
import com.system.gym.management.dto.PaymentSummaryDTO;
import com.system.gym.management.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// src/main/java/com/system/gym/management/controller/DashboardController.java
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;
    private final GymService gymService;
    private final TrainerService trainerService;
    private final PaymentService paymentService;
    private final ClassService classService;
    private final DashboardService dashboardService;

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Object>> getCounts() {
        return ResponseEntity.ok(Map.of(
                "users", userService.count(),
                "gyms", gymService.count(),
                "trainers", trainerService.count(),
                "todayPayments", paymentService.getTodayTotal()
        ));
    }

    @GetMapping("/payments/today")
    public ResponseEntity<Double> getTodayTotal() {
        return ResponseEntity.ok(paymentService.getTodayTotal());
    }

    @GetMapping("/payments/total")
    public ResponseEntity<Double> getAllPaymentsTotal() {
        return ResponseEntity.ok(dashboardService.getAllTimeTotal());
    }

    @GetMapping("/payments/recent")
    public ResponseEntity<List<PaymentSummaryDTO>> getRecentPayments(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(paymentService.getRecentPayments(limit));
    }

    @GetMapping("/classes/upcoming")
    public ResponseEntity<List<ClassSummaryDTO>> getUpcomingClasses(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(classService.getUpcomingClasses(limit));
    }
}