package com.twinmind.model;

public class SuggestionRequest {
    private String transcript;
    private String apiKey;
    private String customPrompt;
    
    public SuggestionRequest() {}
    
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
    
    public String getCustomPrompt() {
        return customPrompt;
    }
    
    public void setCustomPrompt(String customPrompt) {
        this.customPrompt = customPrompt;
    }
}
