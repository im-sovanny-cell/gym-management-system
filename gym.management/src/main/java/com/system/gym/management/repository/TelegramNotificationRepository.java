package com.system.gym.management.repository;

import com.system.gym.management.entity.TelegramNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TelegramNotificationRepository extends JpaRepository<TelegramNotification, Integer> {

    List<TelegramNotification> findTop10ByStatusOrderByCreatedAtAsc(String status);
}
