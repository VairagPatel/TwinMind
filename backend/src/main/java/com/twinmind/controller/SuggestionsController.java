package com.twinmind.controller;

import com.twinmind.model.ErrorResponse;
import com.twinmind.model.SuggestionRequest;
import com.twinmind.model.SuggestionResponse;
import com.twinmind.service.GroqService;
import com.twinmind.service.PromptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SuggestionsController {
    
    @Autowired
    private GroqService groqService;
    
    @Autowired
    private PromptService promptService;
    
    @PostMapping("/suggestions")
    public ResponseEntity<?> generateSuggestions(@RequestBody SuggestionRequest request) {
        System.out.println("Received suggestion request - transcript length: " + 
                         (request.getTranscript() != null ? request.getTranscript().length() : 0) + " chars");
        
        if (request.getApiKey() == null || request.getApiKey().isEmpty()) {
            System.err.println("Missing API key in suggestion request");
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("MISSING_API_KEY", "Groq API key is required"));
        }
        
        if (request.getTranscript() == null || request.getTranscript().isEmpty()) {
            System.err.println("Empty transcript in suggestion request");
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("EMPTY_TRANSCRIPT", "Transcript is required"));
        }
        
        if (request.getTranscript().length() < 50) {
            System.err.println("Transcript too short: " + request.getTranscript().length() + " chars");
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("TRANSCRIPT_TOO_SHORT", "Transcript must be at least 50 characters"));
        }
        
        try {
            System.out.println("Building suggestion prompt...");
            String prompt = promptService.buildSuggestionPrompt(
                    request.getTranscript(), 
                    request.getCustomPrompt()
            );
            
            System.out.println("Calling Groq API for suggestions...");
            SuggestionResponse response = groqService.generateSuggestions(prompt, request.getApiKey()).block();
            
            System.out.println("Suggestions generated successfully: " + 
                             (response != null && response.getSuggestions() != null ? 
                              response.getSuggestions().size() : 0) + " suggestions");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Suggestion generation error: " + e.getClass().getName() + " - " + e.getMessage());
            
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.isEmpty()) {
                errorMessage = "Unknown error: " + e.getClass().getSimpleName();
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("SUGGESTION_FAILED", errorMessage));
        }
    }
}
