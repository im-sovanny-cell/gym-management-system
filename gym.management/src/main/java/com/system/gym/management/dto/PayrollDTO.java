package com.system.gym.management.dto;

import lombok.Data;

@Data
public class PayrollDTO {
    private Integer payrollId;
    private Integer trainerId;
    private String monthYear;
    private Double totalHours;
    private Double totalPay;
    private String paidStatus;
}