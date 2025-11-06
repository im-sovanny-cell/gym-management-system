package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "trainer_payrolls")
@Data
public class TrainerPayroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer payrollId;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    private String monthYear;

    private Double totalHours;

    private Double totalPay;

    private String paidStatus = "unpaid";

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
}