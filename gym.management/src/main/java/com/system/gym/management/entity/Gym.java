package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "gyms")
@Data
public class Gym {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gymId;

//    @Column(nullable = false)
    private String name;

    private String address;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String openingHours;

    public String getName() {
        return name;
    }
}