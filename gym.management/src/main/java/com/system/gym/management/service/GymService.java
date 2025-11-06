package com.system.gym.management.service;

import com.system.gym.management.dto.GymDTO;
import com.system.gym.management.entity.Gym;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.repository.GymRepository;
import com.system.gym.management.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GymService {
    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private MapperUtil mapperUtil;

    public List<GymDTO> getAllGyms() {
        return gymRepository.findAll().stream()
                .map(mapperUtil::toGymDTO)
                .collect(Collectors.toList());
    }

    public GymDTO getGymById(Integer id) {
        Gym gym = gymRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym not found"));
        return mapperUtil.toGymDTO(gym);
    }

    public GymDTO createGym(GymDTO dto) {
        Gym gym = mapperUtil.toGym(dto);
        gym = gymRepository.save(gym);
        return mapperUtil.toGymDTO(gym);
    }

    public GymDTO updateGym(Integer id, GymDTO dto) {
        Gym gym = gymRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym not found"));
        gym.setName(dto.getName());
        gym.setAddress(dto.getAddress());
        gym.setOpeningHours(dto.getOpeningHours());
        // Update owner if needed
        gym = gymRepository.save(gym);
        return mapperUtil.toGymDTO(gym);
    }

    public void deleteGym(Integer id) {
        gymRepository.deleteById(id);
    }
    public long count() {
        return gymRepository.count();
    }
}