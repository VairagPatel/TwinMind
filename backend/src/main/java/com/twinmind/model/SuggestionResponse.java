package com.twinmind.model;

import java.util.List;

public class SuggestionResponse {
    private List<Suggestion> suggestions;
    
    public SuggestionResponse() {}
    
    public SuggestionResponse(List<Suggestion> suggestions) {
        this.suggestions = suggestions;
    }
    
    public List<Suggestion> getSuggestions() {
        return suggestions;
    }
    
    public void setSuggestions(List<Suggestion> suggestions) {
        this.suggestions = suggestions;
    }
    
    public static class Suggestion {
        private String type;
        private String title;
        private String preview;
        
        public Suggestion() {}
        
        public Suggestion(String type, String title, String preview) {
            this.type = type;
            this.title = title;
            this.preview = preview;
        }
        
        public String getType() {
            return type;
        }
        
        public void setType(String type) {
            this.type = type;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getPreview() {
            return preview;
        }
        
        public void setPreview(String preview) {
            this.preview = preview;
        }
    }
}
