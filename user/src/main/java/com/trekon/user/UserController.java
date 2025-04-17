package com.trekon.user;


import com.trekon.user.JwtUtil;
import com.trekon.user.HabitWebClient;
import com.trekon.user.WorkoutWebClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final HabitWebClient habitWebClient;
    private final WorkoutWebClient workoutWebClient;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.register(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        Optional<User> userOpt = userService.login(email, password);
        if (userOpt.isPresent()) {
            String token = jwtUtil.generateToken(email);  // ✅ generate token here
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userOpt.get()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body(Map.of("message", "Logout successful"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        try {
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
            if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
            if (updates.containsKey("age")) user.setAge((Integer) updates.get("age"));
            if (updates.containsKey("height")) user.setHeight(((Number) updates.get("height")).doubleValue());
            if (updates.containsKey("weight")) user.setWeight(((Number) updates.get("weight")).doubleValue());
            if (updates.containsKey("gender")) user.setGender((String) updates.get("gender"));

            return ResponseEntity.ok(userService.saveUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userid}/workout")
    public ResponseEntity<?> addWorkoutToUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        try {
            String workoutId = body.get("workoutId");
            String difficulty = body.get("difficulty");
            User updatedUser = userService.addWorkoutToUser(userid, workoutId, difficulty);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userid}/workout")
    public ResponseEntity<?> removeWorkoutFromUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        try {
            String workoutId = body.get("workoutId");
            User updatedUser = userService.removeWorkoutFromUser(userid, workoutId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{userid}/workout")
    public ResponseEntity<?> getUserWorkouts(@PathVariable String userid) {
        Optional<User> user = userService.getUserById(userid);
        if (user.isPresent()) {
            List<UserWorkout> userWorkouts = user.get().getWorkouts();

            List<Map<String, Object>> enrichedWorkouts = userWorkouts.stream().map(uw -> {
                Map<String, Object> map = new HashMap<>();
                map.put("workoutId", uw.getWorkoutId());
                map.put("completedDates", uw.getCompletedDates());
                map.put("status", uw.getStatus());
                map.put("difficulty", uw.getDifficulty());

                // Fetch workout details from workout service
                Map<String, Object> workoutDetails = workoutWebClient.getWorkoutById(uw.getWorkoutId());
                if (workoutDetails != null) {
                    map.put("name", workoutDetails.get("name"));
                    map.put("description", workoutDetails.get("description"));
                    map.put("type", workoutDetails.get("type"));
                    map.put("target", workoutDetails.get("target"));
                } else {
                    map.put("name", "Unknown Workout");
                    map.put("description", "No Description");
                    map.put("type", "N/A");
                    map.put("target", "N/A");
                }

                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("userWorkouts", enrichedWorkouts));
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userid}/habit")
    public ResponseEntity<?> addHabitToUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        try {
            String habitId = body.get("habitId");
            User updatedUser = userService.addHabitToUser(userid, habitId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userid}/habit")
    public ResponseEntity<?> deleteHabitFromUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        try {
            String habitId = body.get("habitId");
            User updatedUser = userService.removeHabitFromUser(userid, habitId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userid}/habit")
    public ResponseEntity<?> getHabitFromUser(@PathVariable String userid) {
        Optional<User> user = userService.getUserById(userid);
        if (user.isPresent()) {
            List<UserHabit> userHabits = user.get().getHabits();

            List<Map<String, Object>> enrichedHabits = userHabits.stream().map(uh -> {
                Map<String, Object> habitMap = new HashMap<>();
                habitMap.put("habitId", uh.getHabitId());
                habitMap.put("status", uh.getStatus());
                habitMap.put("completedDates", uh.getCompletedDates());

                // Fetch habit details from habit service
                Map<String, Object> habitDetails = habitWebClient.getHabitById(uh.getHabitId());
                habitMap.put("description", habitDetails != null ? 
                        habitDetails.get("description") : "Unknown Habit");

                return habitMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok().body(Map.of("userhabits", enrichedHabits));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userId}/checkHabit")
    public ResponseEntity<?> checkHabit(@PathVariable String userId, @RequestBody Map<String, String> body) {
        try {
            String habitId = body.get("habitId");
            User updatedUser = userService.checkHabit(userId, habitId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @DeleteMapping("/{userId}/checkHabit") 
    public ResponseEntity<?> uncheckHabit(@PathVariable String userId, @RequestBody Map<String, String> body) {
        try {
            String habitId = body.get("habitId");
            User updatedUser = userService.uncheckHabit(userId, habitId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/checkWorkout")
    public ResponseEntity<?> checkWorkout(@PathVariable String userId, @RequestBody Map<String, String> body) {
        try {
            String workoutId = body.get("workoutId");
            User updatedUser = userService.checkWorkout(userId, workoutId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/checkWorkout")
    public ResponseEntity<?> uncheckWorkout(@PathVariable String userId, @RequestBody Map<String, String> body) {
        try {
            String workoutId = body.get("workoutId");
            User updatedUser = userService.uncheckWorkout(userId, workoutId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}