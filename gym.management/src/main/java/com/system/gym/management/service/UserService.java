package com.system.gym.management.service;

import com.system.gym.management.dto.UserDTO;
import com.system.gym.management.entity.User;
import com.system.gym.management.entity.Role;
import com.system.gym.management.entity.Gym;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.repository.UserRepository;
import com.system.gym.management.repository.RoleRepository;
import com.system.gym.management.repository.GymRepository;
import com.system.gym.management.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private MapperUtil mapperUtil;
    @Autowired private PasswordEncoder passwordEncoder;   // ✅ required for hashing password

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(mapperUtil::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapperUtil.toUserDTO(user);
    }

    // ✅ CREATE USER HERE (ADMIN ONLY CALL)
    public UserDTO createUser(UserDTO dto) {
        User user = new User();

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        // ▬▬▬ Role API
        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);

        // ▬▬▬ Gym API
        if (dto.getGymId() != null) {
            Gym gym = gymRepository.findById(dto.getGymId())
                    .orElseThrow(() -> new RuntimeException("Gym not found"));
            user.setGym(gym);
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        return mapperUtil.toUserDTO(user);
    }

    public UserDTO updateUser(Integer id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setIsActive(dto.getIsActive());
        user.setJoinDate(dto.getJoinDate());

        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRole(role);
        }

        if (dto.getGymId() != null) {
            Gym gym = gymRepository.findById(dto.getGymId())
                    .orElseThrow(() -> new ResourceNotFoundException("Gym not found"));
            user.setGym(gym);
        }

        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        return mapperUtil.toUserDTO(user);
    }

    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public long count() {
        return userRepository.count();
    }
}
