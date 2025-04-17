package com.trekon.trekon.service.formatter;

import com.trekon.trekon.model.Habit;
import com.trekon.trekon.model.User;
import com.trekon.trekon.model.UserHabit;
import com.trekon.trekon.model.UserWorkout;
import com.trekon.trekon.model.Workout;
import com.trekon.trekon.repository.HabitRepository;
import com.trekon.trekon.repository.WorkoutRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserActivityFormatter {

    private final WorkoutRepository workoutRepository;
    private final HabitRepository habitRepository;

    public UserActivityFormatter(WorkoutRepository workoutRepository, HabitRepository habitRepository) {
        this.workoutRepository = workoutRepository;
        this.habitRepository = habitRepository;
    }

    public String formatUserActivities(User user) {
        StringBuilder activities = new StringBuilder("User Activities:\n");

        // Format workouts
        if (user.getWorkouts() != null && !user.getWorkouts().isEmpty()) {
            activities.append("Workouts:\n");
            for (UserWorkout workout : user.getWorkouts()) {
                Optional<Workout> workoutOptional = workoutRepository.findById(workout.getWorkoutId());
                workoutOptional.ifPresent(workoutDetails ->
                        activities.append(" - ").append(workoutDetails.getDescription())
                                .append(": Completed on ").append(workout.getCompletedDates())
                                .append("Name ").append(workoutDetails.getName())
                                .append(", Status: ").append(workout.getStatus())
                                .append(", Difficulty: ").append(workoutDetails.getDifficulty()).append("\n")
                );
            }
        }

        // Format habits
        if (user.getHabits() != null && !user.getHabits().isEmpty()) {
            activities.append("Habits:\n");
            for (UserHabit habit : user.getHabits()) {
                Optional<Habit> habitOptional = habitRepository.findById(habit.getHabitId());
                habitOptional.ifPresent(habitDetails ->
                        activities.append(" - ").append(habitDetails.getDescription())
                                .append(": Completed on ").append(habit.getCompletedDates())
                                .append(", Status: ").append(habit.getStatus()).append("\n")
                );
            }
        }

        return activities.toString();
    }
}