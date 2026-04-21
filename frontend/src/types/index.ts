export interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: string;
}

export interface Suggestion {
  type: 'Question to Ask' | 'Talking Point' | 'Fact Check' | 'Clarification' | 'Answer';
  title: string;
  preview: string;
}

export interface SuggestionBatch {
  id: string;
  timestamp: string;
  items: Suggestion[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Settings {
  suggestionPrompt: string;
  chatPrompt: string;
  clickPrompt: string;
  suggestionContextWindow: number;
  chatContextWindow: number;
  refreshIntervalMs: number;
}

export const DEFAULT_SETTINGS: Settings = {
  suggestionPrompt: `You are an intelligent meeting copilot. Analyze the transcript of an ongoing conversation and generate exactly 3 suggestions that would be most useful RIGHT NOW to someone in this meeting.

Rules:
- Return ONLY valid JSON. No preamble, no markdown, no explanation.
- Each suggestion must have: "type", "title", "preview"
- "type" must be one of: "Question to Ask", "Talking Point", "Fact Check", "Clarification", "Answer"
- "preview" must be 2-3 sentences that deliver IMMEDIATE, STANDALONE VALUE — not just a teaser.
- Vary the types across the 3 suggestions.
- Be specific to the actual content of the transcript.`,
  
  chatPrompt: `You are TwinMind, an intelligent AI meeting copilot. You have access to the ongoing meeting transcript. Answer questions clearly and concisely. Be specific to what was actually discussed. If asked about something not in the transcript, say so honestly. Format responses for readability.`,
  
  clickPrompt: `You are an expert meeting copilot providing a detailed, well-researched response. The user clicked on a suggestion during their live meeting. Give them a thorough, structured answer they can immediately use. Use bullet points, key facts, and concrete language. Keep it under 400 words.`,
  
  suggestionContextWindow: 1500,
  chatContextWindow: 6000,
  refreshIntervalMs: 30000,
};
