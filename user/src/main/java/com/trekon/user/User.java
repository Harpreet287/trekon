package com.trekon.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document("user")
@NoArgsConstructor
@AllArgsConstructor
@Data
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
    private List<UserWorkout> workouts = new ArrayList<>();
    private List<UserHabit> habits = new ArrayList<>();
    private List<Map<String, String>> chatMemory = new ArrayList<>();
}