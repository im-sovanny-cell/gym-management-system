// src/main/java/com/system/gym/management/entity/Class.java
package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "classes")
@Data
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer classId;

    @Column(nullable = false)
    private String className;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    private Timestamp startTime;
    private Timestamp endTime;
    private Date classDate;

    private Integer capacity;

    @ManyToOne
    @JoinColumn(name = "gym_id")
    private Gym gym;

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());
    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
}