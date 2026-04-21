package com.twinmind.model;

import java.util.List;

public class ChatRequest {
    private List<ChatMessage> messages;
    private String transcript;
    private String apiKey;
    private String customSystemPrompt;
    
    public ChatRequest() {}
    
    public List<ChatMessage> getMessages() {
        return messages;
    }
    
    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
    
    public String getTranscript() {
        return transcript;
    }
    
    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }
    
    public String getApiKey() {
        return apiKey;
    }
    
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    
    public String getCustomSystemPrompt() {
        return customSystemPrompt;
    }
    
    public void setCustomSystemPrompt(String customSystemPrompt) {
        this.customSystemPrompt = customSystemPrompt;
    }
    
    public static class ChatMessage {
        private String role;
        private String content;
        
        public ChatMessage() {}
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public String getContent() {
            return content;
        }
        
        public void setContent(String content) {
            this.content = content;
        }
    }
}
