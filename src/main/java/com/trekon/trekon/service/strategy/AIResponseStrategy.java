package com.trekon.trekon.service.strategy;

import com.trekon.trekon.model.User;
import java.util.List;
import java.util.Map;

public interface AIResponseStrategy {
    String generateResponse(User user, List<Map<String, String>> chatHistory, String userQuery);
}