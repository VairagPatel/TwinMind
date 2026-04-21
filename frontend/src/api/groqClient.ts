import axios from 'axios';
import { Suggestion, ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transcribeAudio = async (audioBlob: Blob, apiKey: string): Promise<string> => {
  const formData = new FormData();
  
  // Determine file extension based on blob type
  // Groq supports: FLAC, MP3, M4A, MPEG, MPGA, OGG, WAV, WEBM
  let filename = 'audio.webm';
  if (audioBlob.type.includes('wav')) {
    filename = 'audio.wav';
  } else if (audioBlob.type.includes('ogg')) {
    filename = 'audio.ogg';
  } else if (audioBlob.type.includes('mpeg') || audioBlob.type.includes('mp3')) {
    filename = 'audio.mp3';
  } else if (audioBlob.type.includes('m4a')) {
    filename = 'audio.m4a';
  } else if (audioBlob.type.includes('flac')) {
    filename = 'audio.flac';
  }
  
  formData.append('audio', audioBlob, filename);
  
  const response = await apiClient.post('/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-API-Key': apiKey,
    },
  });
  
  return response.data.text;
};

export const generateSuggestions = async (
  transcript: string,
  apiKey: string,
  customPrompt?: string
): Promise<Suggestion[]> => {
  const response = await apiClient.post('/suggestions', {
    transcript,
    apiKey,
    customPrompt,
  });
  
  return response.data.suggestions;
};

export const sendChatMessage = async (
  messages: Array<{ role: string; content: string }>,
  transcript: string,
  apiKey: string,
  customSystemPrompt?: string
): Promise<string> => {
  const response = await apiClient.post('/chat', {
    messages,
    transcript,
    apiKey,
    customSystemPrompt,
  });
  
  return response.data.content;
};
