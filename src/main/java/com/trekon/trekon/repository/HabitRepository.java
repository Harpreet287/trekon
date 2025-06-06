package com.trekon.trekon.repository;

import com.trekon.trekon.model.Habit;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface HabitRepository extends MongoRepository<Habit, String> {

    Optional<Object> getHabitById(String id);
}
