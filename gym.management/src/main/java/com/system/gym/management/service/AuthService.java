package com.system.gym.management.service;

import com.system.gym.management.dto.LoginRequest;
import com.system.gym.management.dto.LoginResponse;
import com.system.gym.management.dto.RegisterRequest;
import com.system.gym.management.dto.UserDTO;
import com.system.gym.management.entity.Role;
import com.system.gym.management.entity.User;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.mapper.UserMapper;
import com.system.gym.management.repository.RoleRepository;
import com.system.gym.management.repository.UserRepository;
import com.system.gym.management.security.JwtTokenProvider;
import com.system.gym.management.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MapperUtil mapperUtil;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserDTO userDTO = mapperUtil.toUserDTO(user);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(userDTO);
        return response;
    }

    public void register(RegisterRequest request) {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        user.setRole(role);
        // Set gym if provided
        userRepository.save(user);
    }
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserMapper::toDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}