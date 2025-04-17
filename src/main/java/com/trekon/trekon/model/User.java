package com.trekon.trekon.model;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document("user")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class User {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private int age;
    private double weight;
    private double height;
    private String gender;
    private List<UserWorkout> workouts;
    private List<UserHabit>habits;
    private List<Map<String, String>> chatMemory;

}


