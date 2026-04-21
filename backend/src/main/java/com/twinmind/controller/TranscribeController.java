package com.twinmind.controller;

import com.twinmind.model.ErrorResponse;
import com.twinmind.model.TranscribeResponse;
import com.twinmind.service.GroqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class TranscribeController {
    
    @Autowired
    private GroqService groqService;
    
    @PostMapping("/transcribe")
    public ResponseEntity<?> transcribe(
            @RequestParam("audio") MultipartFile audioFile,
            @RequestHeader("X-API-Key") String apiKey) {
        
        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("MISSING_API_KEY", "Groq API key is required"));
        }
        
        if (audioFile.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("EMPTY_FILE", "Audio file is required"));
        }
        
        try {
            System.out.println("Transcribing audio file: " + audioFile.getOriginalFilename() + 
                             ", size: " + audioFile.getSize() + " bytes, type: " + audioFile.getContentType());
            
            String transcription = groqService.transcribeAudio(audioFile, apiKey).block();
            
            System.out.println("Transcription completed successfully");
            return ResponseEntity.ok(new TranscribeResponse(transcription));
        } catch (Exception e) {
            System.err.println("Transcription error: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.isEmpty()) {
                errorMessage = "Unknown transcription error: " + e.getClass().getSimpleName();
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("TRANSCRIPTION_FAILED", errorMessage));
        }
    }
}
