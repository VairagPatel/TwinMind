import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import SettingsModal from './SettingsModal';

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { transcript, suggestionBatches, chatMessages } = useAppStore();
  
  const exportSession = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      transcript: transcript.map(chunk => ({
        timestamp: chunk.timestamp,
        text: chunk.text,
      })),
      suggestionBatches: suggestionBatches.map(batch => ({
        timestamp: batch.timestamp,
        suggestions: batch.items.map(item => ({
          type: item.type,
          title: item.title,
          preview: item.preview,
        })),
      })),
      chat: chatMessages.map(msg => ({
        timestamp: msg.timestamp,
        role: msg.role,
        content: msg.content,
      })),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinmind-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <>
      <header className="h-16 bg-dark-panel border-b border-dark-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-semibold">TwinMind</h1>
          <span className="text-sm text-gray-500">Live Suggestions</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportSession}
            className="px-4 py-2 bg-dark-hover hover:bg-dark-border rounded-lg text-sm transition-colors"
          >
            Export Session
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 bg-dark-hover hover:bg-dark-border rounded-lg flex items-center justify-center transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default Header;
