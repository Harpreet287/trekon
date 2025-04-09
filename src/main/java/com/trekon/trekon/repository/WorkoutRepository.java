package com.trekon.trekon.repository;

import com.trekon.trekon.model.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WorkoutRepository extends MongoRepository<Workout, String> {

}
