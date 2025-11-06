// src/main/java/com/system/gym/management/dto/ClassSummaryDTO.java
package com.system.gym.management.dto;

import lombok.Data;

@Data
public class ClassSummaryDTO {
    private Integer classId;
    private String className;
    private String trainerName;
    private String classDate;     // "2025-11-05"
    private String startTime;     // "14:30"
    private Integer capacity;
}