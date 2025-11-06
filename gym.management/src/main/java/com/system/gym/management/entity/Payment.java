package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    @Column(nullable = false)
    private Double amount;

    private Date paymentDate = new Date(System.currentTimeMillis());

    private String method;

    private String status = "paid";

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
}