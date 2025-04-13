package com.trekon.trekon.service;

import com.trekon.trekon.model.User;
import com.trekon.trekon.model.UserHabit;
import com.trekon.trekon.model.UserWorkout;
import com.trekon.trekon.model.Workout;
import com.trekon.trekon.model.Habit;
import com.trekon.trekon.repository.WorkoutRepository;
import com.trekon.trekon.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIDoctorService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiUrl;

    private final WorkoutRepository workoutRepository;
    private final HabitRepository habitRepository;

    private static final String PREPROMPT = "You are a fitness coach AI. Provide workout advice, answer fitness-related questions, and help users with their workout logs.";

    public String getResponse(User user, List<Map<String, String>> chatHistory, String userQuery) {
        RestTemplate restTemplate = new RestTemplate();
        String fullUrl = geminiUrl + "?key=" + geminiApiKey;

        List<Map<String, Object>> parts = new ArrayList<>();

        // Add the preprompt as the first message
        parts.add(Map.of("parts", List.of(Map.of("text", PREPROMPT)), "role", "user"));

        // Add user activities to the context
        String userActivities = formatUserActivities(user);
        parts.add(Map.of("parts", List.of(Map.of("text", userActivities)), "role", "user"));

        // Add chat history
        parts.addAll(chatHistory.stream().map(msg -> Map.of(
                "parts", List.of(Map.of("text", msg.get("text"))),
                "role", msg.get("role").equals("ai") ? "model" : msg.get("role")
        )).collect(Collectors.toList()));

        // Add the current user query
        parts.add(Map.of("parts", List.of(Map.of("text", userQuery)), "role", "user"));

        Map<String, Object> body = Map.of("contents", parts);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> res = restTemplate.postForEntity(fullUrl, entity, Map.class);

            Map candidate = (Map) ((List<?>) res.getBody().get("candidates")).get(0);
            Map content = (Map) candidate.get("content");
            List<Map<String, String>> partsList = (List<Map<String, String>>) content.get("parts");
            return partsList.get(0).get("text");

        } catch (Exception e) {
            return "Something went wrong: " + e.getMessage();
        }
    }

    private String formatUserActivities(User user) {
        StringBuilder activities = new StringBuilder("User Activities:\n");

        // Format workouts
        if (user.getWorkouts() != null && !user.getWorkouts().isEmpty()) {
            activities.append("Workouts:\n");
            for (UserWorkout workout : user.getWorkouts()) {
                Optional<Workout> workoutOptional = workoutRepository.findById(workout.getWorkoutId());
                workoutOptional.ifPresent(workoutDetails ->
                        activities.append(" - ").append(workoutDetails.getDescription())
                                .append(": Completed on ").append(workout.getCompletedDates())
                                .append("Name ").append(workoutDetails.getName())
                                .append(", Status: ").append(workout.getStatus())
                                .append(", Difficulty: ").append(workoutDetails.getDifficulty()).append("\n")
                );
            }
        }

        // Format habits
        if (user.getHabits() != null && !user.getHabits().isEmpty()) {
            activities.append("Habits:\n");
            for (UserHabit habit : user.getHabits()) {
                Optional<Habit> habitOptional = habitRepository.findById(habit.getHabitId());
                habitOptional.ifPresent(habitDetails ->
                        activities.append(" - ").append(habitDetails.getDescription())
                                .append(": Completed on ").append(habit.getCompletedDates())
                                .append(", Status: ").append(habit.getStatus()).append("\n")
                );
            }
        }

        return activities.toString();
    }
}
