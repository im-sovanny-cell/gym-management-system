package com.system.gym.management.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class TelegramService {

    @Value("${telegram.api.url}")
    private String telegramApiUrl;

    private final RestTemplate rest = new RestTemplate();

    public void queueNotification(String msg, String chatId, Object user) {

        try {
            String url = telegramApiUrl + "/sendMessage?chat_id=" + chatId + "&text=" + msg;
            rest.getForObject(url, String.class);
            System.out.println("Telegram sent: " + msg);
        } catch (Exception e) {
            System.out.println("Telegram send failed: " + e.getMessage());
        }
    }
}
