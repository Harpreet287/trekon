package com.trekon.workout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("workout")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workout {
    @Id
    private String id;
    private String name;
    private String description;
    private String type; // reps or time
    private String target; // cardio/calisthenics/strength
    private String difficulty; // easy/medium/hard
}
