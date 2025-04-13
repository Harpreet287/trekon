package com.trekon.trekon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWorkout {
    private String workoutId;
    private List<LocalDate> completedDates;
    private String status;
    private String difficulty;
}
