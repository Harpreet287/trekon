package com.trekon.trekon.service;

import com.trekon.trekon.model.Habit;
import com.trekon.trekon.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitService {
    private final HabitRepository habitRepo;

    public List<Habit> getAllHabits(){
        return habitRepo.findAll();
    }
    public Habit addHabit(Habit habit){
        return habitRepo.save(habit);
    }
    public void deleteHabit(String id){
        habitRepo.deleteById(id);
    }
}
