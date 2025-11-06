package com.system.gym.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GymApplication {
	public static void main(String[] args) {
		System.setProperty("user.timezone", "Asia/Phnom_Penh");
		SpringApplication.run(GymApplication.class, args);
	}

}
