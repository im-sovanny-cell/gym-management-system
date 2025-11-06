// src/main/java/com/system/gym/management/dto/TrainerDTO.java
package com.system.gym.management.dto;

import lombok.Data;

@Data
public class TrainerDTO {
    private Integer trainerId;
    private Integer userId;
    private String specialization;
    private String certifications;
    private String hireDate;        // "2025-01-05"
    private Double hourlyRate;
    private String employmentType;
}