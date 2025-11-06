package com.system.gym.management.service;

import com.system.gym.management.dto.ClassDTO;
import com.system.gym.management.dto.ClassSummaryDTO;
import com.system.gym.management.entity.Class;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.repository.ClassRepository;
import com.system.gym.management.repository.GymRepository;
import com.system.gym.management.repository.TrainerRepository;
import com.system.gym.management.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final TrainerRepository trainerRepository;
    private final GymRepository gymRepository;
    private final MapperUtil mapperUtil;

    // DASHBOARD → upcoming classes
    public List<ClassSummaryDTO> getUpcomingClasses(int limit) {
        return classRepository.findUpcomingClasses(PageRequest.of(0, limit))
                .stream()
                .map(mapperUtil::toClassSummaryDTO)
                .collect(Collectors.toList());
    }

    // ================ CRUD =================

    public ClassDTO create(ClassDTO dto) {
        validateReferences(dto);
        Class entity = mapperUtil.toClass(dto);

        // IMPORTANT — set FK objects
        if (dto.getTrainerId() != null)
            entity.setTrainer(trainerRepository.findById(dto.getTrainerId()).orElse(null));

        if (dto.getGymId() != null)
            entity.setGym(gymRepository.findById(dto.getGymId()).orElse(null));

        entity.setCreatedAt(now());
        entity.setUpdatedAt(now());
        return mapperUtil.toClassDTO(classRepository.save(entity));
    }

    public List<ClassDTO> getAll() {
        return classRepository.findAll().stream()
                .map(mapperUtil::toClassDTO)
                .collect(Collectors.toList());
    }

    public ClassDTO getById(Integer id) {
        Class entity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + id));
        return mapperUtil.toClassDTO(entity);
    }

    public ClassDTO update(Integer id, ClassDTO dto) {
        Class existing = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + id));

        validateReferences(dto);
        Class updated = mapperUtil.toClass(dto);
        updated.setClassId(id);

        // IMPORTANT — set FK objects
        if (dto.getTrainerId() != null)
            updated.setTrainer(trainerRepository.findById(dto.getTrainerId()).orElse(null));

        if (dto.getGymId() != null)
            updated.setGym(gymRepository.findById(dto.getGymId()).orElse(null));

        updated.setCreatedAt(existing.getCreatedAt());
        updated.setUpdatedAt(now());

        return mapperUtil.toClassDTO(classRepository.save(updated));
    }

    public void delete(Integer id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found: " + id);
        }
        classRepository.deleteById(id);
    }

    // ================================================
    // helpers
    private void validateReferences(ClassDTO dto) {
        if (dto.getTrainerId() != null && !trainerRepository.existsById(dto.getTrainerId())) {
            throw new ResourceNotFoundException("Trainer not found: " + dto.getTrainerId());
        }
        if (dto.getGymId() != null && !gymRepository.existsById(dto.getGymId())) {
            throw new ResourceNotFoundException("Gym not found: " + dto.getGymId());
        }
    }

    private Timestamp now() {
        return Timestamp.valueOf(LocalDateTime.now());
    }
}
