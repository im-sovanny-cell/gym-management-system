package com.system.gym.management.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class TelegramNotifier {
    @Value("${telegram.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendNotification(String message, String chatId) {
        String url = apiUrl + "/sendMessage";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"chat_id\":\"" + chatId + "\",\"text\":\"" + message + "\"}";
        HttpEntity<String> request = new HttpEntity<>(body, headers);
        restTemplate.postForObject(url, request, String.class);
    }
}