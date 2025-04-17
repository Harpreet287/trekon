package com.trekon.habit;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habit")
@RequiredArgsConstructor
public class HabitController {
    private final HabitService habitService;

    @GetMapping
    public List<Habit> getAllHabits() {
        return habitService.getAllHabits();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabitById(@PathVariable String id) {
        return habitService.getHabitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
