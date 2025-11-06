// src/main/java/com/system/gym/management/dto/UserDTO.java
package com.system.gym.management.dto;

import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;

@Data
public class UserDTO {
    private Integer userId;
    private String firstName;
    private String lastName;
    @Getter
    private String password;
    public void setPassword(String password) { this.password = password; }
    private String email;
    private String phone;
    private LocalDate joinDate;
    private String address;
    private Integer roleId;
    private String roleName;
    private Integer gymId;
    private String gymName;
    private Boolean isActive;
}