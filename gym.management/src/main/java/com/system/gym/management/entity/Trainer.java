// src/main/java/com/system/gym/management/entity/Trainer.java
package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "trainers")
@Data
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer trainerId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String specialization;
    private String certifications;
    private Date hireDate;
    private Double hourlyRate;
    private String employmentType = "full-time";

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());
    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
}