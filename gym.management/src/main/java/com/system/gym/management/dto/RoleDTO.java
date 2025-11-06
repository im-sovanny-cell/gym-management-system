package com.system.gym.management.dto;

import lombok.Data;

@Data
public class RoleDTO {
    private Integer roleId;
    private String roleName;
    private String permissions;
}
