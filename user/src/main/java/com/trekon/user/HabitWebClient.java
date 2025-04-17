package com.trekon.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class HabitWebClient {
    private final WebClient webClient;

    public HabitWebClient(@Value("${service.habit.url}") String habitServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(habitServiceUrl)
                .build();
    }

    public Map<String, Object> getHabitById(String habitId) {
        return webClient.get()
                .uri("/api/habit/{id}", habitId)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}