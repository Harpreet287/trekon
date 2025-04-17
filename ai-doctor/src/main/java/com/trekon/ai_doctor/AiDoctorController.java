package com.trekon.trekon.controller;

import com.trekon.trekon.service.AIDoctorService;
import com.trekon.trekon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class AiDoctorController {

    private final AIDoctorService aiDoctorService;
    private final UserService userService;

    @PostMapping("/{userId}/ai-doctor")
    public ResponseEntity<?> chatWithAi(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String query = body.get("query");

        return userService.getUserById(userId).map(user -> {
            List<Map<String, String>> history = user.getChatMemory() != null
                    ? user.getChatMemory()
                    : new ArrayList<>();
            // get ai response
            String aiReply = aiDoctorService.getResponse(user, history, query);
            // make history
            history.add(Map.of("role", "user", "text", query));
            history.add(Map.of("role", "ai", "text", aiReply));
            // save history
            user.setChatMemory(history);
            userService.saveUser(user);

            return ResponseEntity.ok(Map.of("response", aiReply, "history", history));
        }).orElse(ResponseEntity.notFound().build());
    }
}
