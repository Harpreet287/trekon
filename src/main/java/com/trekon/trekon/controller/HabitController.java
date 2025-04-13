package com.trekon.trekon.controller;


import com.trekon.trekon.model.Habit;
import com.trekon.trekon.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habit")
@RequiredArgsConstructor

public class HabitController {
    private final HabitService habitService;

    @GetMapping
    public List<Habit> getAllHabits() {
        return habitService.getAllHabits();
    }
    @PostMapping
    public Habit createHabit(@RequestBody Habit habit) {
        return habitService.addHabit(habit);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok().build();
    }
}
