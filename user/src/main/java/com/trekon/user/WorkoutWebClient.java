package com.trekon.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class WorkoutWebClient {
    private final WebClient webClient;

    public WorkoutWebClient(@Value("${service.workout.url}") String workoutServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(workoutServiceUrl)
                .build();
    }

    public Map<String, Object> getWorkoutById(String workoutId) {
        return webClient.get()
                .uri("/api/workouts/{id}", workoutId)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}
