package com.trekon.workout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkoutService {
    private final WorkoutRepository workoutRepository;

    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }
    
    public Optional<Workout> getWorkoutById(String id) {
        return workoutRepository.findById(id);
    }

    public Workout addWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }

    public void deleteWorkout(String id) {
        workoutRepository.deleteById(id);
    }
}
