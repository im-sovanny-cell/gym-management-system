// src/main/java/com/system/gym/management/config/SecurityConfig.java
package com.system.gym.management.config;

import com.system.gym.management.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)  // Enables @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // PUBLIC: Authentication
                        .requestMatchers("/api/auth/**").permitAll()

                        // PUBLIC: Read-only data for UI
                        .requestMatchers("/api/users", "/api/users/**").permitAll()
                        .requestMatchers("/api/roles", "/api/roles/**").permitAll()
                        .requestMatchers("/api/gyms", "/api/gyms/**").permitAll()

                        // PAYMENTS: Allow POST for testing (remove in production)
                        .requestMatchers(HttpMethod.POST, "/api/payments").permitAll()

                        // TRAINERS: ADMIN only for write
                        .requestMatchers(HttpMethod.POST, "/api/trainers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/trainers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/trainers/**").hasRole("ADMIN")

                        // TRAINERS: Authenticated users can read
                        .requestMatchers(HttpMethod.GET, "/api/trainers", "/api/trainers/**").authenticated()

                        // DASHBOARD: Authenticated users
                        .requestMatchers("/api/dashboard/**").authenticated()

                        // ALL OTHER ENDPOINTS: Require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}