package com.trekon.trekon.repository;

import com.trekon.trekon.model.Habit;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HabitRepository extends MongoRepository<Habit, String> {

}
