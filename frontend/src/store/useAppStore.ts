import { create } from 'zustand';
import { TranscriptChunk, SuggestionBatch, ChatMessage, Settings, DEFAULT_SETTINGS } from '../types';

interface AppStore {
  apiKey: string;
  isRecording: boolean;
  transcript: TranscriptChunk[];
  suggestionBatches: SuggestionBatch[];
  chatMessages: ChatMessage[];
  settings: Settings;
  
  setApiKey: (key: string) => void;
  toggleRecording: () => void;
  addTranscriptChunk: (chunk: TranscriptChunk) => void;
  addSuggestionBatch: (batch: SuggestionBatch) => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
  getFullTranscript: () => string;
  getRecentTranscript: (maxChars: number) => string;
}

export const useAppStore = create<AppStore>((set, get) => ({
  apiKey: localStorage.getItem('groq_api_key') || '',
  isRecording: false,
  transcript: [],
  suggestionBatches: [],
  chatMessages: [],
  settings: DEFAULT_SETTINGS,
  
  setApiKey: (key: string) => {
    localStorage.setItem('groq_api_key', key);
    set({ apiKey: key });
  },
  
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
  
  addTranscriptChunk: (chunk: TranscriptChunk) => 
    set((state) => ({ transcript: [...state.transcript, chunk] })),
  
  addSuggestionBatch: (batch: SuggestionBatch) => 
    set((state) => ({ suggestionBatches: [batch, ...state.suggestionBatches] })),
  
  addChatMessage: (msg: ChatMessage) => 
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  
  updateSettings: (newSettings: Partial<Settings>) => 
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
  
  getFullTranscript: () => {
    const state = get();
    return state.transcript.map(chunk => chunk.text).join(' ');
  },
  
  getRecentTranscript: (maxChars: number) => {
    const fullTranscript = get().getFullTranscript();
    if (fullTranscript.length <= maxChars) {
      return fullTranscript;
    }
    return fullTranscript.slice(-maxChars);
  },
}));
