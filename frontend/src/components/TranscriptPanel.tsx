import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

interface TranscriptPanelProps {
  onToggleRecording: () => void;
}

const TranscriptPanel = ({ onToggleRecording }: TranscriptPanelProps) => {
  const { isRecording, transcript } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className="h-full flex flex-col bg-dark-panel border-r border-dark-border">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Transcript</h2>
          <div className="flex items-center gap-2">
            <motion.div
              animate={isRecording ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
              className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-600'}`}
            />
            <span className="text-sm text-gray-400">{isRecording ? 'REC' : 'STOPPED'}</span>
          </div>
        </div>
        
        <button
          onClick={onToggleRecording}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            isRecording
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
              : 'bg-accent-primary hover:bg-accent-secondary text-white'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isRecording && transcript.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-4"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </motion.div>
            <p className="text-sm">Listening...</p>
            <p className="text-xs mt-1">Speak to start transcription</p>
          </div>
        )}
        
        {!isRecording && transcript.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-sm">Click "Start Recording" to begin</p>
          </div>
        )}
        
        {transcript.map((chunk) => (
          <motion.div
            key={chunk.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-bg rounded-lg p-3"
          >
            <div className="text-xs text-gray-500 mb-1 font-mono">{formatTime(chunk.timestamp)}</div>
            <div className="text-sm leading-relaxed">{chunk.text}</div>
          </motion.div>
        ))}
      </div>
      
      {isRecording && (
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ['8px', '24px', '8px'] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: i * 0.1,
                }}
                className="w-1 bg-accent-primary rounded-full"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptPanel;
