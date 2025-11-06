// src/main/java/com/system/gym/management/controller/TelegramController.java
package com.system.gym.management.controller;

import com.system.gym.management.service.TelegramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/telegram")
@RequiredArgsConstructor
public class TelegramController {

    private final TelegramService telegram;
    private final String CHAT_ID = "-1003278994755";

    @PostMapping("/notify")
    public ResponseEntity<?> notify(@RequestBody PaymentRequest req) {

        String msg = """
                ------------------------------------------------
                💰 PAYMENT RECEIVED
                ------------------------------------------------
                📍 Payment ID : %d
                🔑 User ID    : %d
                👤 Username   : %s
                💵 Amount     : $%.2f
                🏦 Bank       : %s
                ------------------------------------------------
                """.formatted(
                req.paymentId,
                req.userId,
                req.userName,
                req.amount,
                req.bank
        );

        telegram.queueNotification(msg, CHAT_ID, null);

        return ResponseEntity.ok("sent");
    }

    private record PaymentRequest(Integer paymentId, Integer userId, String userName, Double amount, String bank) { }
}
