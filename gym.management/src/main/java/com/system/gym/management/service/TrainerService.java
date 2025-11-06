// src/main/java/com/system/gym/management/service/TrainerService.java
package com.system.gym.management.service;

import com.system.gym.management.dto.TrainerDTO;
import com.system.gym.management.entity.Trainer;
import com.system.gym.management.entity.User;
import com.system.gym.management.repository.TrainerRepository;
import com.system.gym.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public TrainerDTO create(TrainerDTO dto) {
        Trainer trainer = new Trainer();

        // Map userId → User object
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
            trainer.setUser(user);
        }

        trainer.setSpecialization(dto.getSpecialization());
        trainer.setCertifications(dto.getCertifications());

        // String → java.sql.Date
        if (dto.getHireDate() != null && !dto.getHireDate().isEmpty()) {
            trainer.setHireDate(java.sql.Date.valueOf(dto.getHireDate()));
        }

        trainer.setHourlyRate(dto.getHourlyRate());
        trainer.setEmploymentType(dto.getEmploymentType() != null ? dto.getEmploymentType() : "full-time");

        trainer.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        trainer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        Trainer saved = trainerRepository.save(trainer);
        return toDto(saved);
    }

    // READ ALL
    public List<TrainerDTO> getAll() {
        return trainerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // READ BY ID
    public TrainerDTO getById(Integer id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        return toDto(trainer);
    }

    // UPDATE
    public TrainerDTO update(Integer id, TrainerDTO dto) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            trainer.setUser(user);
        }

        trainer.setSpecialization(dto.getSpecialization());
        trainer.setCertifications(dto.getCertifications());

        if (dto.getHireDate() != null && !dto.getHireDate().isEmpty()) {
            trainer.setHireDate(java.sql.Date.valueOf(dto.getHireDate()));
        }

        trainer.setHourlyRate(dto.getHourlyRate());
        trainer.setEmploymentType(dto.getEmploymentType());

        trainer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Trainer updated = trainerRepository.save(trainer);
        return toDto(updated);
    }

    // DELETE
    public void delete(Integer id) {
        trainerRepository.deleteById(id);
    }

    // Helper: Entity → DTO
    private TrainerDTO toDto(Trainer entity) {
        TrainerDTO dto = new TrainerDTO();
        dto.setTrainerId(entity.getTrainerId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getUserId() : null);
        dto.setSpecialization(entity.getSpecialization());
        dto.setCertifications(entity.getCertifications());
        dto.setHireDate(entity.getHireDate() != null ? entity.getHireDate().toString() : null);
        dto.setHourlyRate(entity.getHourlyRate());
        dto.setEmploymentType(entity.getEmploymentType());
        return dto;
    }
    public long count() {
        return trainerRepository.count();
    }
}