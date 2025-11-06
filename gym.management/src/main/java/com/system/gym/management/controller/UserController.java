// src/main/java/com/system/gym/management/controller/UserController.java
package com.system.gym.management.controller;

import com.system.gym.management.dto.UserDTO;
import com.system.gym.management.entity.User;
import com.system.gym.management.service.UserService;
import com.system.gym.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;  // ← ADD THIS

    @Autowired
    private PasswordEncoder passwordEncoder; // ← ADD THIS (if using Spring Security)

    // GET /api/users
    @GetMapping("/users")
    public ResponseEntity<Map<String, List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(Map.of("data", users));
    }

    // GET /api/users/{id}
    @GetMapping("/users/{id}")
    public UserDTO getUser(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    // POST /api/users
//    @PostMapping("/users")
//    public ResponseEntity<?> createUser(@RequestBody UserDTO dto) {
//        userService.createUser(dto);
//        return ResponseEntity.ok(Map.of("message", "User created"));
//    }

    @PostMapping("/users")
    public ResponseEntity<?> create(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }



    // PUT /api/users/{id}
    @PutMapping("/users/{id}")
    public UserDTO updateUser(@PathVariable Integer id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // CHANGE PASSWORD: PUT /api/users/{id}/password
    @PutMapping("/users/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        if (password == null || password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must be at least 6 characters"));
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(password));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}