package com.trekon.trekon.controller;


import com.trekon.trekon.model.*;
import com.trekon.trekon.repository.HabitRepository;
import com.trekon.trekon.repository.UserRepository;
import com.trekon.trekon.repository.WorkoutRepository;
import com.trekon.trekon.security.JwtUtil;
import com.trekon.trekon.service.HabitService;
import com.trekon.trekon.service.UserService;
import com.trekon.trekon.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final HabitRepository habitRepo;
    private final WorkoutRepository workoutRepo;
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final WorkoutService workoutService;
    private final WorkoutRepository workoutRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try{
            User newUser = userService.register(user);
            return ResponseEntity.ok(newUser);
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        Optional<User> user = userService.login(email, password);
        if (user.isPresent()) {
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", user.get()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body(Map.of("message", "Logout successful"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        System.out.println(id);
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Only update fields you want to allow
        if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
        if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
        if (updates.containsKey("age")) user.setAge((Integer) updates.get("age"));
        if (updates.containsKey("height")) user.setHeight(((Number) updates.get("height")).doubleValue());
        if (updates.containsKey("weight")) user.setWeight(((Number) updates.get("weight")).doubleValue());
        if (updates.containsKey("gender")) user.setGender((String) updates.get("gender"));

        return ResponseEntity.ok(userRepository.save(user));
    }


    @PostMapping("/{userid}/workout")
    public ResponseEntity<?> addWorkoutToUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        String workoutId = body.get("workoutId");
        String difficulty = body.get("difficulty");
        return userService.getUserById(userid).map(user -> {
            List<UserWorkout> workouts = user.getWorkouts();
            boolean exists = workouts.stream()
                    .anyMatch(w -> w.getWorkoutId().equals(workoutId));
            if (!exists) {

                workouts.add(new UserWorkout(workoutId, new ArrayList<>(), "incomplete", difficulty ));
                user.setWorkouts(workouts);
                userService.saveUser(user);
            }
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userid}/workout")
    public ResponseEntity<?> removeWorkoutFromUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        String workoutId = body.get("workoutId");
        return userService.getUserById(userid).map(user -> {
            List<UserWorkout> workouts = user.getWorkouts();
            workouts.removeIf(w -> w.getWorkoutId().equals(workoutId));
            user.setWorkouts(workouts);
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
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

                Optional<Workout> w = workoutRepo.findById(uw.getWorkoutId());
                map.put("name", w.map(Workout::getName).orElse("Unknown Workout"));
                map.put("description", w.map(Workout::getDescription).orElse("No Description"));
                map.put("type", w.map(Workout::getType).orElse("N/A"));
                map.put("target", w.map(Workout::getTarget).orElse("N/A"));

                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("userWorkouts", enrichedWorkouts));
        }

        return ResponseEntity.notFound().build();
    }

// adding new habit to the user
    @PostMapping("/{userid}/habit")
    public ResponseEntity<?> addHabitToUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");
        Optional<User> user = userService.getUserById(userid);
        if (user.isPresent()) {
            boolean exists = user.get().getHabits().stream()
                    .anyMatch(h -> h.getHabitId().equals(habitId));
            if (!exists) {
                UserHabit userHabit = new UserHabit(habitId, new ArrayList<>(), "incomplete");
                user.get().getHabits().add(userHabit);
                userService.saveUser(user.get());
            }
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
// delete one habit from the user
    @DeleteMapping("/{userid}/habit")
    public ResponseEntity<?> deleteHabitFromUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");
        Optional<User> user = userService.getUserById(userid);
        if (user.isPresent()) {
            user.get().getHabits().removeIf(h -> h.getHabitId().equals(habitId));
            userService.saveUser(user.get());
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    // get all habits
    @GetMapping("/{userid}/habit")
    public ResponseEntity<?> getHabitFromUser(@PathVariable String userid) {
        Optional<User> user = userService.getUserById(userid);
        if (user.isPresent()) {
            List<UserHabit> userHabits = user.get().getHabits();

            // Construct enriched response
            List<Map<String, Object>> enrichedHabits = userHabits.stream().map(uh -> {
                Map<String, Object> habitMap = new HashMap<>();
                habitMap.put("habitId", uh.getHabitId());
                habitMap.put("status", uh.getStatus());
                habitMap.put("completedDates", uh.getCompletedDates());

                Optional<Habit> h = habitRepo.findById(uh.getHabitId());
                habitMap.put("description", h.map(Habit::getDescription).orElse("Unknown Habit"));

                return habitMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok().body(Map.of("userhabits", enrichedHabits));
        }
        return ResponseEntity.notFound().build();
    }

    // Streak calculation
    // check a particular habit
    @PostMapping("/{userId}/checkHabit")
    public ResponseEntity<?> checkHabit(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");

        return userService.getUserById(userId).map(user -> {
            user.getHabits().forEach(h -> {
                if (h.getHabitId().equals(habitId)) {
                    LocalDate today = LocalDate.now();
                    System.out.println(today);
                    System.out.println(h.getCompletedDates());
                    if (!h.getCompletedDates().contains(today)) {
                        System.out.println("ADDING HABIT");
                        h.getCompletedDates().add(today);
                        h.setStatus("completed");
                    }
                }
            });
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{userId}/checkHabit")
    // uncheck a particular habit
    public ResponseEntity<?> uncheckHabit(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");
        System.out.println(habitId);
        return userService.getUserById(userId).map(user -> {
            user.getHabits().forEach(h -> {
                if (h.getHabitId().equals(habitId)) {
                    LocalDate today = LocalDate.now();
                    System.out.println(today);
                    System.out.println(h.getCompletedDates());

                    if (h.getCompletedDates().contains(today)) {
                        System.out.println(h.getCompletedDates());
                        h.getCompletedDates().remove(today);
                        h.setStatus("incomplete");
                    }
                }
            });
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    // mark workout as complete
    @PostMapping("/{userId}/checkWorkout")
    public ResponseEntity<?> checkWorkout(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String workoutId = body.get("workoutId");

        return userService.getUserById(userId).map(user -> {
            LocalDate today = LocalDate.now();
            user.getWorkouts().forEach(w -> {
                if (w.getWorkoutId().equals(workoutId) && !w.getCompletedDates().contains(today)) {
                    w.getCompletedDates().add(today);
                    w.setStatus("completed");
                }
            });
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
    // un mark workout as complete

    @DeleteMapping("/{userId}/checkWorkout")
    public ResponseEntity<?> uncheckWorkout(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String workoutId = body.get("workoutId");

        return userService.getUserById(userId).map(user -> {
            LocalDate today = LocalDate.now();
            user.getWorkouts().forEach(w -> {
                if (w.getWorkoutId().equals(workoutId)) {
                    w.getCompletedDates().remove(today);
                    w.setStatus("incomplete");
                }
            });
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

}
