package com.trekon.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserHabit {
    private String habitId;
    private List<LocalDate> completedDates = new ArrayList<>();
    private String status;
}