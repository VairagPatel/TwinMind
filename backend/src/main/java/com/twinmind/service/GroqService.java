package com.twinmind.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twinmind.model.SuggestionResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {
    
    private static final String GROQ_BASE_URL = "https://api.groq.com";
    private static final String WHISPER_MODEL = "whisper-large-v3";
    private static final String CHAT_MODEL = "openai/gpt-oss-120b";
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public GroqService() {
        this.webClient = WebClient.builder()
                .baseUrl(GROQ_BASE_URL)
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public Mono<String> transcribeAudio(MultipartFile audioFile, String apiKey) {
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            
            // Get the bytes directly to avoid resource issues
            byte[] audioBytes = audioFile.getBytes();
            String filename = audioFile.getOriginalFilename();
            if (filename == null || filename.isEmpty()) {
                filename = "audio.webm";
            }
            
            // Determine content type - ensure it's a supported format
            String contentType = audioFile.getContentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "audio/webm";
            }
            
            // Ensure filename has proper extension
            if (!filename.contains(".")) {
                filename = "audio.webm";
            }
            
            // For Groq API, use application/octet-stream to avoid format issues
            // The API will detect the format from the file content
            System.out.println("Preparing transcription request - filename: " + filename + 
                             ", size: " + audioBytes.length + " bytes, original type: " + contentType);
            
            // Groq expects the file part - use octet-stream for better compatibility
            builder.part("file", audioBytes)
                    .filename(filename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM);
            builder.part("model", WHISPER_MODEL);
            builder.part("response_format", "json");
            builder.part("language", "en");
            
            return webClient.post()
                    .uri("/openai/v1/audio/transcriptions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                            .flatMap(errorBody -> {
                                System.err.println("Groq API error response: " + errorBody);
                                return Mono.error(new RuntimeException(
                                    "Groq API error (" + response.statusCode() + "): " + errorBody
                                ));
                            })
                    )
                    .bodyToMono(String.class)
                    .flatMap(responseBody -> {
                        try {
                            // Parse JSON response to extract text
                            JsonNode root = objectMapper.readTree(responseBody);
                            String transcription = root.path("text").asText();
                            System.out.println("Groq API returned transcription: " + 
                                             (transcription != null ? transcription.length() + " chars" : "null"));
                            return Mono.just(transcription);
                        } catch (Exception e) {
                            System.err.println("Failed to parse transcription response: " + e.getMessage());
                            return Mono.error(new RuntimeException("Failed to parse transcription: " + e.getMessage()));
                        }
                    })
                    .onErrorResume(e -> {
                        System.err.println("Groq API error: " + e.getClass().getName() + " - " + e.getMessage());
                        return Mono.error(new RuntimeException("Transcription API failed: " + e.getMessage(), e));
                    });
        } catch (Exception e) {
            System.err.println("Error preparing transcription request: " + e.getMessage());
            return Mono.error(new RuntimeException("Failed to prepare audio file: " + e.getMessage(), e));
        }
    }
    
    public Mono<SuggestionResponse> generateSuggestions(String prompt, String apiKey) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", CHAT_MODEL);
        
        List<Map<String, String>> messages = new ArrayList<>();
        
        // Add system message for JSON formatting
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You must respond with valid JSON only. No markdown, no explanation, just pure JSON.");
        messages.add(systemMessage);
        
        // Add user message with the prompt
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);
        
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 600);
        requestBody.put("response_format", Map.of("type", "json_object"));
        
        return webClient.post()
                .uri("/openai/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    try {
                        System.out.println("Raw Groq API response: " + response);
                        JsonNode root = objectMapper.readTree(response);
                        String content = root.path("choices").get(0).path("message").path("content").asText();
                        
                        System.out.println("Extracted content: " + content);
                        
                        // Clean up the content - remove markdown code blocks if present
                        content = content.trim();
                        if (content.startsWith("```json")) {
                            content = content.substring(7);
                        }
                        if (content.startsWith("```")) {
                            content = content.substring(3);
                        }
                        if (content.endsWith("```")) {
                            content = content.substring(0, content.length() - 3);
                        }
                        content = content.trim();
                        
                        System.out.println("Cleaned content for parsing: " + content);
                        
                        // Parse the suggestions JSON - handle both array and object formats
                        SuggestionResponse suggestionResponse;
                        JsonNode contentNode = objectMapper.readTree(content);
                        
                        if (contentNode.isArray()) {
                            // Direct array format: [{...}, {...}, {...}]
                            List<SuggestionResponse.Suggestion> suggestions = objectMapper.readValue(
                                content, 
                                objectMapper.getTypeFactory().constructCollectionType(List.class, SuggestionResponse.Suggestion.class)
                            );
                            suggestionResponse = new SuggestionResponse(suggestions);
                        } else {
                            // Object format: {"suggestions": [{...}, {...}, {...}]}
                            suggestionResponse = objectMapper.readValue(content, SuggestionResponse.class);
                        }
                        
                        // Validate we have exactly 3 suggestions
                        if (suggestionResponse.getSuggestions() == null || suggestionResponse.getSuggestions().size() != 3) {
                            System.err.println("Invalid number of suggestions: " + 
                                (suggestionResponse.getSuggestions() != null ? suggestionResponse.getSuggestions().size() : "null"));
                            return Mono.error(new RuntimeException("Expected exactly 3 suggestions, got: " + 
                                (suggestionResponse.getSuggestions() != null ? suggestionResponse.getSuggestions().size() : "null")));
                        }
                        
                        System.out.println("Successfully parsed " + suggestionResponse.getSuggestions().size() + " suggestions");
                        return Mono.just(suggestionResponse);
                    } catch (Exception e) {
                        System.err.println("Failed to parse suggestions response: " + e.getMessage());
                        return Mono.error(new RuntimeException("Failed to parse suggestions: " + e.getMessage()));
                    }
                })
                .onErrorResume(e -> {
                    System.err.println("Suggestion generation error: " + e.getMessage());
                    return Mono.error(new RuntimeException("Suggestion generation failed: " + e.getMessage()));
                });
    }
    
    public Mono<String> chat(String systemPrompt, List<Map<String, String>> messages, String apiKey) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", CHAT_MODEL);
        
        List<Map<String, String>> allMessages = new ArrayList<>();
        
        // Add system prompt as first message
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        allMessages.add(systemMessage);
        
        // Add conversation messages
        allMessages.addAll(messages);
        
        requestBody.put("messages", allMessages);
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 2000);
        
        return webClient.post()
                .uri("/openai/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    try {
                        JsonNode root = objectMapper.readTree(response);
                        String content = root.path("choices").get(0).path("message").path("content").asText();
                        return Mono.just(content);
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException("Failed to parse chat response: " + e.getMessage()));
                    }
                })
                .onErrorResume(e -> Mono.error(new RuntimeException("Chat failed: " + e.getMessage())));
    }
}
