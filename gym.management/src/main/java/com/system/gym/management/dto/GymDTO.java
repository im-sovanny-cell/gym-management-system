package com.system.gym.management.dto;

import lombok.Data;

@Data
public class GymDTO {
    private Integer gymId;
    private String name;
    private String address;
    private Integer ownerId;
    private String openingHours;
    private String province;

}