package com.system.gym.management.repository;

import com.system.gym.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    Attendance findTopByUserIdOrderByIdDesc(Integer userId);

}
