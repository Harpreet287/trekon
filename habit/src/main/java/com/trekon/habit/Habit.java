package com.trekon.habit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("habit")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Habit {
    @Id
    private String id;
    private String description;
}