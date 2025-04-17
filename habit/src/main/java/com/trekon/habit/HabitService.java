package com.trekon.habit;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitService {
    private final HabitRepository habitRepo;

    public List<Habit> getAllHabits() {
        return habitRepo.findAll();
    }
    
    public Optional<Habit> getHabitById(String id) {
        return habitRepo.findById(id);
    }

    public Habit addHabit(Habit habit) {
        return habitRepo.save(habit);
    }

    public void deleteHabit(String id) {
        habitRepo.deleteById(id);
    }
}

