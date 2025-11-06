package com.system.gym.management.controller;

import com.system.gym.management.dto.GymDTO;
import com.system.gym.management.repository.GymRepository;
import com.system.gym.management.service.GymService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gyms")
@CrossOrigin(origins = "http://localhost:5173")
public class GymController {
    @Autowired
    private GymService gymService;
    @Autowired
    private GymRepository gymRepository;


    @GetMapping
    public ResponseEntity<List<GymDTO>> getAllGyms() {
        return ResponseEntity.ok(gymService.getAllGyms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymDTO> getGymById(@PathVariable Integer id) {
        return ResponseEntity.ok(gymService.getGymById(id));
    }

    @PostMapping
    public ResponseEntity<GymDTO> createGym(@RequestBody GymDTO dto) {
        return ResponseEntity.ok(gymService.createGym(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GymDTO> updateGym(@PathVariable Integer id, @RequestBody GymDTO dto) {
        return ResponseEntity.ok(gymService.updateGym(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGym(@PathVariable Integer id) {
        gymService.deleteGym(id);
        return ResponseEntity.ok().build();
    }
}