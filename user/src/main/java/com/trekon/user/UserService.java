package com.trekon.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public User addWorkoutToUser(String userId, String workoutId, String difficulty) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        boolean exists = user.getWorkouts().stream()
                .anyMatch(w -> w.getWorkoutId().equals(workoutId));
                
        if (!exists) {
            user.getWorkouts().add(new UserWorkout(workoutId, new ArrayList<>(), "incomplete", difficulty));
            return saveUser(user);
        }
        
        return user;
    }
    
    public User removeWorkoutFromUser(String userId, String workoutId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.getWorkouts().removeIf(w -> w.getWorkoutId().equals(workoutId));
        return saveUser(user);
    }
    
    public User checkWorkout(String userId, String workoutId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        LocalDate today = LocalDate.now();
        
        user.getWorkouts().forEach(w -> {
            if (w.getWorkoutId().equals(workoutId) && !w.getCompletedDates().contains(today)) {
                w.getCompletedDates().add(today);
                w.setStatus("completed");
            }
        });
        
        return saveUser(user);
    }
    
    public User uncheckWorkout(String userId, String workoutId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        LocalDate today = LocalDate.now();
        
        user.getWorkouts().forEach(w -> {
            if (w.getWorkoutId().equals(workoutId)) {
                w.getCompletedDates().remove(today);
                w.setStatus("incomplete");
            }
        });
        
        return saveUser(user);
    }
    
    public User addHabitToUser(String userId, String habitId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        boolean exists = user.getHabits().stream()
                .anyMatch(h -> h.getHabitId().equals(habitId));
                
        if (!exists) {
            user.getHabits().add(new UserHabit(habitId, new ArrayList<>(), "incomplete"));
            return saveUser(user);
        }
        
        return user;
    }
    
    public User removeHabitFromUser(String userId, String habitId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.getHabits().removeIf(h -> h.getHabitId().equals(habitId));
        return saveUser(user);
    }
    
    public User checkHabit(String userId, String habitId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        LocalDate today = LocalDate.now();
        
        user.getHabits().forEach(h -> {
            if (h.getHabitId().equals(habitId) && !h.getCompletedDates().contains(today)) {
                h.getCompletedDates().add(today);
                h.setStatus("completed");
            }
        });
        
        return saveUser(user);
    }
    
    public User uncheckHabit(String userId, String habitId) {
        User user = getUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        LocalDate today = LocalDate.now();
        
        user.getHabits().forEach(h -> {
            if (h.getHabitId().equals(habitId)) {
                h.getCompletedDates().remove(today);
                h.setStatus("incomplete");
            }
        });
        
        return saveUser(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
