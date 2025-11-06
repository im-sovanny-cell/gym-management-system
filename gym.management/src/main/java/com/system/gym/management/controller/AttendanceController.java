package com.system.gym.management.controller;

import com.system.gym.management.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping("/scan")
    public ResponseEntity<String> scan(@RequestParam Integer userId) {
        String msg = attendanceService.scan(userId);
        return ResponseEntity.ok(msg);
    }
}