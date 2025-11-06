// src/main/java/com/system/gym/management/entity/TelegramNotification.java
package com.system.gym.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "telegram_notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelegramNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String chatId;

    private String message;

    @Builder.Default
    private String status = "pending";

    private Timestamp sentAt;

    @Builder.Default
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Builder.Default
    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
}