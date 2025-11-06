package com.system.gym.management.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.gym.management.dto.MembershipDTO;
import com.system.gym.management.entity.Gym;
import com.system.gym.management.entity.Membership;
import com.system.gym.management.entity.User;
import com.system.gym.management.repository.GymRepository;
import com.system.gym.management.repository.MembershipRepository;
import com.system.gym.management.repository.UserRepository;

@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GymRepository gymRepository;

    public MembershipDTO create(MembershipDTO dto) {
        Membership entity = new Membership();
        mapDtoToEntity(dto, entity);
        entity.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        entity.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Membership saved = membershipRepository.save(entity);
        return toDto(saved);
    }

    public List<MembershipDTO> getAll() {
        return membershipRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MembershipDTO getById(Integer id) {
        Membership entity = membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        return toDto(entity);
    }

    public MembershipDTO update(Integer id, MembershipDTO dto) {
        Membership entity = membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        mapDtoToEntity(dto, entity);
        entity.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Membership updated = membershipRepository.save(entity);
        return toDto(updated);
    }

    public void delete(Integer id) {
        membershipRepository.deleteById(id);
    }

    private void mapDtoToEntity(MembershipDTO dto, Membership entity) {

        // User
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            entity.setUser(user);
        }

        // Gym
        if (dto.getGymId() != null) {
            Gym gym = gymRepository.findById(dto.getGymId())
                    .orElseThrow(() -> new RuntimeException("Gym not found"));
            entity.setGym(gym);
        }

        // Trainer
        if (dto.getTrainerId() != null) {
            User trainer = userRepository.findById(dto.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found"));
            entity.setTrainer(trainer);
        }

        // dates
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());

        entity.setPlanType(dto.getPlanType());
        entity.setStatus(dto.getStatus());
    }

    private MembershipDTO toDto(Membership entity) {
        MembershipDTO dto = new MembershipDTO();
        dto.setMembershipId(entity.getMembershipId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getUserId() : null);
        dto.setPlanType(entity.getPlanType());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStatus(entity.getStatus());
        dto.setGymId(entity.getGym() != null ? entity.getGym().getGymId() : null);
        dto.setTrainerId(entity.getTrainer() != null ? entity.getTrainer().getUserId() : null);
        return dto;
    }
}
