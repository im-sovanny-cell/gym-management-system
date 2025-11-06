package com.system.gym.management.controller;

import com.system.gym.management.dto.ClassSummaryDTO;
import com.system.gym.management.dto.PaymentSummaryDTO;
import com.system.gym.management.service.DashboardListService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardListController {

    private final DashboardListService dashboardListService;

    @GetMapping("/payments/recent")
    public ResponseEntity<List<PaymentSummaryDTO>> recentPayments(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(dashboardListService.getRecentPayments(limit));
    }

    @GetMapping("/classes/upcoming")
    public ResponseEntity<List<ClassSummaryDTO>> upcomingClasses(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(dashboardListService.getUpcomingClasses(limit));
    }
}