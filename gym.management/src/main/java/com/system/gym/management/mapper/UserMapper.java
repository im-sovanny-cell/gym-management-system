package com.system.gym.management.mapper;

import com.system.gym.management.dto.UserDTO;
import com.system.gym.management.entity.User;

public class UserMapper {

    public static UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());

        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getRoleName());
        }

        if (user.getGym() != null) {
            dto.setGymName(user.getGym().getName());
        }

        return dto;
    }
}
