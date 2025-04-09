package com.trekon.trekon.controller;

import com.trekon.trekon.model.Workout;
import com.trekon.trekon.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping
    public List<Workout> getAll() {
        return workoutService.getAllWorkouts();
    }

    @PostMapping
    public Workout create(@RequestBody Workout workout) {
        return workoutService.addWorkout(workout);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok().build();
    }
}
