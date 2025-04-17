package com.trekon.user;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Use lambda to configure CSRF
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Use lambda to configure authorization
        return http.build();
    }
}
