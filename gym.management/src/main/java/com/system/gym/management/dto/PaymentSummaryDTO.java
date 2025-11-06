// src/main/java/com/system/gym/management/dto/PaymentSummaryDTO.java
package com.system.gym.management.dto;

import lombok.Data;

@Data
public class PaymentSummaryDTO {
    private Integer paymentId;
    private String userName;
    private Double amount;
    private String method;
    private String paymentDate;
    private String status;

    public class ClassSummaryDTO {
        private Integer classId;
        private String className;
        private String trainerName;
        private String classDate;
        private String startTime;
        private Integer capacity;
    }
}