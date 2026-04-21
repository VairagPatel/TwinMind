import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Suggestion } from '../types';
import SuggestionCard from './SuggestionCard';
import { motion } from 'framer-motion';

interface SuggestionsPanelProps {
  onSuggestionClick: (suggestion: Suggestion) => void;
  onRefresh: () => void;
  isLoading: boolean;
  error: string | null;
}

const SuggestionsPanel = ({ onSuggestionClick, onRefresh, isLoading, error }: SuggestionsPanelProps) => {
  const { suggestionBatches, apiKey } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const handleSuggestionClick = (suggestion: Suggestion, batchId: string, index: number) => {
    const id = `${batchId}-${index}`;
    setSelectedId(id);
    onSuggestionClick(suggestion);
  };
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  if (!apiKey) {
    return (
      <div className="h-full flex flex-col bg-dark-panel border-r border-dark-border">
        <div className="p-4 border-b border-dark-border">
          <h2 className="text-lg font-semibold">Live Suggestions</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <svg className="w-12 h-12 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-400 mb-2">Please add your Groq API key in Settings</p>
            <p className="text-sm text-gray-600">Click the gear icon in the top right</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-dark-panel border-r border-dark-border">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Live Suggestions</h2>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-8 h-8 bg-dark-hover hover:bg-dark-border rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            title="Refresh suggestions"
          >
            <motion.svg
              animate={isLoading ? { rotate: 360 } : {}}
              transition={isLoading ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-3">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={onRefresh}
              className="text-xs text-red-300 hover:underline mt-1"
            >
              Try again
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading && suggestionBatches.length === 0 && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-dark-bg rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-dark-hover rounded w-1/3 mb-3" />
                <div className="h-4 bg-dark-hover rounded w-full mb-2" />
                <div className="h-4 bg-dark-hover rounded w-2/3" />
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && suggestionBatches.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm">No suggestions yet</p>
            <p className="text-xs mt-1">Start recording to generate suggestions</p>
          </div>
        )}
        
        {suggestionBatches.map((batch, batchIndex) => (
          <div key={batch.id}>
            {batchIndex > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-dark-border" />
                <span className="text-xs text-gray-600">{formatTimeAgo(batch.timestamp)}</span>
                <div className="flex-1 h-px bg-dark-border" />
              </div>
            )}
            
            <div className="space-y-3">
              {batch.items.map((suggestion, index) => (
                <SuggestionCard
                  key={`${batch.id}-${index}`}
                  suggestion={suggestion}
                  onClick={() => handleSuggestionClick(suggestion, batch.id, index)}
                  isSelected={selectedId === `${batch.id}-${index}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPanel;
