package com.trekon.trekon.facade;

import com.trekon.trekon.model.User;
import com.trekon.trekon.service.UserService;
import com.trekon.trekon.service.strategy.AIResponseStrategy;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class AIDoctorFacade {

    private final AIResponseStrategy aiResponseStrategy;
    private final UserService userService;

    public AIDoctorFacade(AIResponseStrategy aiResponseStrategy, UserService userService) {
        this.aiResponseStrategy = aiResponseStrategy;
        this.userService = userService;
    }

    public Map<String, Object> processChatRequest(String userId, String query) {
        Optional<User> userOptional = userService.getUserById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<Map<String, String>> history = user.getChatMemory() != null
                    ? user.getChatMemory()
                    : new ArrayList<>();

            // Get AI response using strategy
            String aiReply = aiResponseStrategy.generateResponse(user, history, query);

            // Update history
            history.add(Map.of("role", "user", "text", query));
            history.add(Map.of("role", "ai", "text", aiReply));

            // Save history
            user.setChatMemory(history);
            userService.saveUser(user);

            return Map.of("response", aiReply, "history", history);
        }

        return null;
    }
}