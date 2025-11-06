// src/main/java/com/system/gym/management/controller/TrainerController.java
package com.system.gym.management.controller;

import com.system.gym.management.dto.TrainerDTO;
import com.system.gym.management.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDTO> create(
            @Valid @RequestBody TrainerDTO dto,
            UriComponentsBuilder ucb) {

        TrainerDTO created = trainerService.create(dto);
        URI location = ucb.path("/api/trainers/{id}")
                .buildAndExpand(created.getTrainerId())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    // READ ALL
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TrainerDTO>> getAll() {
        return ResponseEntity.ok(trainerService.getAll());
    }

    // READ ONE
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TrainerDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(trainerService.getById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody TrainerDTO dto) {

        return ResponseEntity.ok(trainerService.update(id, dto));
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        trainerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}