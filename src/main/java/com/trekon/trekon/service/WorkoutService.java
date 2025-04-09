package com.trekon.trekon.service;

import com.trekon.trekon.model.Workout;
import com.trekon.trekon.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    public Workout addWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }

    public void deleteWorkout(String id) {
        workoutRepository.deleteById(id);
    }
}
