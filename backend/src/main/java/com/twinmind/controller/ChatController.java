package com.twinmind.controller;

import com.twinmind.model.ChatRequest;
import com.twinmind.model.ChatResponse;
import com.twinmind.model.ErrorResponse;
import com.twinmind.service.GroqService;
import com.twinmind.service.PromptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {
    
    @Autowired
    private GroqService groqService;
    
    @Autowired
    private PromptService promptService;
    
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        if (request.getApiKey() == null || request.getApiKey().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("MISSING_API_KEY", "Groq API key is required"));
        }
        
        if (request.getMessages() == null || request.getMessages().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("EMPTY_MESSAGES", "Messages are required"));
        }
        
        try {
            String systemPrompt = promptService.buildChatSystemPrompt(
                    request.getTranscript() != null ? request.getTranscript() : "",
                    request.getCustomSystemPrompt()
            );
            
            List<Map<String, String>> messages = new ArrayList<>();
            for (ChatRequest.ChatMessage msg : request.getMessages()) {
                Map<String, String> message = new HashMap<>();
                message.put("role", msg.getRole());
                message.put("content", msg.getContent());
                messages.add(message);
            }
            
            String responseContent = groqService.chat(systemPrompt, messages, request.getApiKey()).block();
            return ResponseEntity.ok(new ChatResponse(responseContent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("CHAT_FAILED", e.getMessage()));
        }
    }
}
