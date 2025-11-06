// src/main/java/com/system/gym/management/dto/ClassDTO.java
package com.system.gym.management.dto;

import lombok.Data;

@Data
public class ClassDTO {
    private Integer classId;
    private String className;
    private Integer trainerId;
    private Integer gymId;
    private String classDate;     // "2025-11-06"
    private String startTime;     // "14:30"
    private String endTime;       // "15:30"
    private Integer capacity;

}