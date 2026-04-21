package com.twinmind.service;

import org.springframework.stereotype.Service;

@Service
public class PromptService {
    
    private static final String DEFAULT_SUGGESTION_SYSTEM_PROMPT = 
        "You are a meeting copilot. Generate exactly 3 actionable suggestions for the current conversation.\n\n" +
        "Rules:\n" +
        "- Return ONLY valid JSON array: [{\"type\":\"...\",\"title\":\"...\",\"preview\":\"...\"},...]\n" +
        "- Types: \"Question to Ask\", \"Talking Point\", \"Fact Check\", \"Clarification\", \"Answer\"\n" +
        "- Preview: 2-3 sentences with immediate value\n" +
        "- Vary types across suggestions\n" +
        "- Be specific to the transcript content";
    
    private static final String DEFAULT_CHAT_SYSTEM_PROMPT = 
        "You are TwinMind, an intelligent AI meeting copilot. You have access to the ongoing meeting transcript. " +
        "Answer questions clearly and concisely. Be specific to what was actually discussed. " +
        "If asked about something not in the transcript, say so honestly. " +
        "Format responses for readability — use bullet points for lists, bold for key terms.";
    
    public String buildSuggestionPrompt(String transcript, String customPrompt) {
        String systemPrompt = (customPrompt != null && !customPrompt.isEmpty()) 
            ? customPrompt 
            : DEFAULT_SUGGESTION_SYSTEM_PROMPT;
        
        String userPrompt = String.format(
            "Transcript:\n%s\n\nGenerate 3 suggestions.",
            transcript
        );
        
        return systemPrompt + "\n\n" + userPrompt;
    }
    
    public String buildClickExpandPrompt(String transcript, String type, String title, String preview) {
        String systemPrompt = 
            "You are an expert meeting copilot providing a detailed, well-researched response. " +
            "The user clicked on a suggestion during their live meeting. " +
            "Give them a thorough, structured answer they can immediately use. " +
            "Use bullet points, key facts, and concrete language. Be specific, not generic. " +
            "Keep it under 400 words.";
        
        String userPrompt = String.format(
            "Full transcript context:\n%s\n\n" +
            "The user clicked this suggestion:\n" +
            "Type: %s\n" +
            "Title: %s\n" +
            "Preview: %s\n\n" +
            "Provide a detailed, immediately useful expansion of this suggestion.",
            transcript, type, title, preview
        );
        
        return systemPrompt + "\n\nUser: " + userPrompt;
    }
    
    public String buildChatSystemPrompt(String transcript, String customSystemPrompt) {
        String basePrompt = (customSystemPrompt != null && !customSystemPrompt.isEmpty())
            ? customSystemPrompt
            : DEFAULT_CHAT_SYSTEM_PROMPT;
        
        return basePrompt + "\n\nCurrent meeting transcript:\n" + transcript;
    }
}
