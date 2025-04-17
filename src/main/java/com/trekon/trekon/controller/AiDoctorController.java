package com.trekon.trekon.controller;

import com.trekon.trekon.facade.AIDoctorFacade;
import com.trekon.trekon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class AiDoctorController {

    private final AIDoctorFacade aiDoctorFacade;
    private final UserService userService;

    @PostMapping("/{userId}/ai-doctor")
    public ResponseEntity<?> chatWithAi(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String query = body.get("query");
        
        Map<String, Object> result = aiDoctorFacade.processChatRequest(userId, query);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}