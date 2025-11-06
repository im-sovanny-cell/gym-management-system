package com.system.gym.management.dto;

import lombok.Data;

import java.sql.Date;

@Data
public class PaymentDTO {
    private Integer paymentId;
    private Integer userId;
    private String userName;
    private Integer membershipId;
    private Double amount;
    private Date paymentDate;
    private String method;
    private String status;
}