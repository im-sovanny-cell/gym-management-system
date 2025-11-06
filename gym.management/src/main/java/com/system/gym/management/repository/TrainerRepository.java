package com.system.gym.management.repository;

import com.system.gym.management.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {

    @Query("SELECT COUNT(t) FROM Trainer t WHERE t.employmentType = 'full-time'")
    Long countActiveTrainers();

}
