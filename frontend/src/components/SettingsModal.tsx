import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { apiKey, setApiKey, settings, updateSettings, resetSettings } = useAppStore();
  
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localSettings, setLocalSettings] = useState(settings);
  
  const handleSave = () => {
    setApiKey(localApiKey);
    updateSettings(localSettings);
    onClose();
  };
  
  const handleReset = () => {
    resetSettings();
    setLocalSettings(useAppStore.getState().settings);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-panel border border-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-dark-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-dark-hover rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Groq API Key</label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">console.groq.com</a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Live Suggestion Prompt</label>
            <textarea
              value={localSettings.suggestionPrompt}
              onChange={(e) => setLocalSettings({ ...localSettings, suggestionPrompt: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chat System Prompt</label>
            <textarea
              value={localSettings.chatPrompt}
              onChange={(e) => setLocalSettings({ ...localSettings, chatPrompt: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Click-to-Expand Prompt</label>
            <textarea
              value={localSettings.clickPrompt}
              onChange={(e) => setLocalSettings({ ...localSettings, clickPrompt: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Suggestion Context (chars)</label>
              <input
                type="number"
                value={localSettings.suggestionContextWindow}
                onChange={(e) => setLocalSettings({ ...localSettings, suggestionContextWindow: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Chat Context (chars)</label>
              <input
                type="number"
                value={localSettings.chatContextWindow}
                onChange={(e) => setLocalSettings({ ...localSettings, chatContextWindow: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
            <input
              type="number"
              value={localSettings.refreshIntervalMs / 1000}
              onChange={(e) => setLocalSettings({ ...localSettings, refreshIntervalMs: parseInt(e.target.value) * 1000 })}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-dark-border flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Reset to Defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-accent-primary hover:bg-accent-secondary rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
