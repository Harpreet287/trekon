package com.trekon.trekon.controller;


import com.trekon.trekon.model.User;
import com.trekon.trekon.model.UserHabit;
import com.trekon.trekon.model.Workout;
import com.trekon.trekon.repository.UserRepository;
import com.trekon.trekon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

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
        String username = creds.get("username");
        String password = creds.get("password");

        Optional<User> user = userService.login(username, password);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
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

    @PostMapping("/{userid}/workout")
    public ResponseEntity<?> addWorkoutToUser(@PathVariable String userid,  @RequestBody Map<String, String> body) {

        String workoutId = body.get("workoutId");
        return userService.getUserById(userid).map(user -> {
            List<String> workouts = user.getWorkouts();
            System.out.println(workoutId+"HIIIIIII");
            System.out.println(workouts);
            if (!workouts.contains(workoutId)) {
                System.out.println(workoutId+"HIIIIIII");
                workouts.add(workoutId);
                user.setWorkouts(workouts);
                userService.saveUser(user);
            }
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userid}/workout")
    public ResponseEntity<?> deleteUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        String workoutId = body.get("workoutId");
        return userService.getUserById(userid).map(user->{
            List<String> workouts = user.getWorkouts();
            workouts.remove(workoutId);
            user.setWorkouts(workouts);
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userid}/workout")
    public ResponseEntity<?> getWorkout(@PathVariable String userid) {
        Optional<User> user =  userService.getUserById(userid);
        if(user.isPresent()) {
            return ResponseEntity.ok().body(Map.of("user", user.get().getWorkouts()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userid}/habit")
    public ResponseEntity<?> addHabitToUser(@PathVariable String userid, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");
        Optional<User> user = userService.getUserById(userid);
        if (user.isPresent()) {
            boolean exists = user.get().getHabits().stream()
                    .anyMatch(h -> h.getHabitId().equals(habitId));
            if (!exists) {
                UserHabit userHabit = new UserHabit(habitId, new ArrayList<>());
                user.get().getHabits().add(userHabit);
                userService.saveUser(user.get());
            }
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

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


    @GetMapping("/{userid}/habit")
    public ResponseEntity<?> getHabitFromUser(@PathVariable String userid) {
        Optional<User> user =  userService.getUserById(userid);
        if(user.isPresent()) {
            return ResponseEntity.ok().body(Map.of("userhabits", user.get().getHabits()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userId}/checkHabit")
    public ResponseEntity<?> checkHabit(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");

        return userService.getUserById(userId).map(user -> {
            user.getHabits().forEach(h -> {
                if (h.getHabitId().equals(habitId)) {
                    LocalDate today = LocalDate.now();
                    if (!h.getCompletedDates().contains(today)) {
                        h.getCompletedDates().add(today);
                    }
                }
            });
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{userId}/checkHabit")
    public ResponseEntity<?> uncheckHabit(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String habitId = body.get("habitId");

        return userService.getUserById(userId).map(user -> {
            user.getHabits().forEach(h -> {
                if (h.getHabitId().equals(habitId)) {
                    LocalDate today = LocalDate.now();
                    if (!h.getCompletedDates().contains(today)) {
                        h.getCompletedDates().remove(today);
                    }
                }
            });
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

}
