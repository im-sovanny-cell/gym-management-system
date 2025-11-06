package com.system.gym.management.controller;

import com.system.gym.management.dto.LoginRequest;
import com.system.gym.management.dto.LoginResponse;
import com.system.gym.management.dto.RegisterRequest;
import com.system.gym.management.dto.UserDTO;
import com.system.gym.management.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = authentication.getName();
        UserDTO user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }


}
