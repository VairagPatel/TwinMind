import { useEffect, useRef, useCallback, useState } from 'react';
import { generateSuggestions } from '../api/groqClient';
import { useAppStore } from '../store/useAppStore';

export const useSuggestionRefresh = (flushAudio: () => Promise<void>) => {
  const { 
    isRecording, 
    apiKey, 
    settings, 
    getRecentTranscript, 
    addSuggestionBatch 
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  
  const fetchSuggestions = useCallback(async () => {
    if (isRefreshingRef.current) return;
    if (!apiKey) {
      setError('API key is missing');
      return;
    }
    
    isRefreshingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // Flush audio first
      await flushAudio();
      
      // Wait a bit for transcription to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transcript = getRecentTranscript(settings.suggestionContextWindow);
      
      if (!transcript || transcript.trim().length < 50) {
        setError('Not enough transcript data yet');
        return;
      }
      
      const suggestions = await generateSuggestions(
        transcript,
        apiKey,
        settings.suggestionPrompt
      );
      
      addSuggestionBatch({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        items: suggestions,
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch suggestions:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [apiKey, settings, getRecentTranscript, addSuggestionBatch, flushAudio]);
  
  // Auto-refresh when recording
  useEffect(() => {
    if (isRecording && apiKey) {
      // Initial fetch after 30 seconds
      const initialTimeout = setTimeout(() => {
        fetchSuggestions();
      }, 30000);
      
      // Then every interval
      intervalRef.current = setInterval(() => {
        fetchSuggestions();
      }, settings.refreshIntervalMs);
      
      return () => {
        clearTimeout(initialTimeout);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRecording, apiKey, settings.refreshIntervalMs, fetchSuggestions]);
  
  return {
    fetchSuggestions,
    isLoading,
    error,
  };
};
