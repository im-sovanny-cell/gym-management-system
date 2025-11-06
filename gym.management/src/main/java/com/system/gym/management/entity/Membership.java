package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "memberships")
@Data
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer membershipId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;


    @Column(length = 50)
    private String planType;

    private Date startDate = new Date(System.currentTimeMillis());

    private Date endDate;

    private String status = "active";

    @ManyToOne
    @JoinColumn(name = "gym_id")
    private Gym gym;

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
}