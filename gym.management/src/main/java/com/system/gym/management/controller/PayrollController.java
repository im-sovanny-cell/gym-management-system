package com.system.gym.management.controller;

import com.system.gym.management.dto.PayrollDTO;
import com.system.gym.management.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payrolls")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @GetMapping
    public ResponseEntity<List<PayrollDTO>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayrollDTO> getPayrollById(@PathVariable Integer id) {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @PostMapping
    public ResponseEntity<PayrollDTO> createPayroll(@RequestBody PayrollDTO dto) {
        return ResponseEntity.ok(payrollService.createPayroll(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PayrollDTO> updatePayroll(@PathVariable Integer id, @RequestBody PayrollDTO dto) {
        return ResponseEntity.ok(payrollService.updatePayroll(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Integer id) {
        payrollService.deletePayroll(id);
        return ResponseEntity.ok().build();
    }

    // 🔥 NEW — AUTO HOURS API
    @GetMapping("/auto-hours")
    public ResponseEntity<?> getTotalHours(
            @RequestParam Integer trainerId,
            @RequestParam String month
    ) {
        double hours = payrollService.calculateMonthlyHours(trainerId, month);
        return ResponseEntity.ok(Map.of("totalHours", hours));
    }


}
