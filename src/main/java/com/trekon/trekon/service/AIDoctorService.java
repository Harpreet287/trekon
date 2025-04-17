package com.trekon.trekon.service;

import com.trekon.trekon.model.User;
import com.trekon.trekon.service.formatter.UserActivityFormatter;
import com.trekon.trekon.service.strategy.AIResponseStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIDoctorService {

    private final AIResponseStrategy aiResponseStrategy;
    private final UserActivityFormatter userActivityFormatter;

    public String getResponse(User user, List<Map<String, String>> chatHistory, String userQuery) {
        return aiResponseStrategy.generateResponse(user, chatHistory, userQuery);
    }
    
    // This method can be kept for backward compatibility or removed if all calls are updated
    public String formatUserActivities(User user) {
        return userActivityFormatter.formatUserActivities(user);
    }
}