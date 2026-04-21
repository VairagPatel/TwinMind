import { useState, useEffect, useRef } from 'react';
import { useAppStore } from './store/useAppStore';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { generateSuggestions, sendChatMessage } from './api/groqClient';
import { Suggestion } from './types';

function App() {
  const { 
    isRecording, 
    toggleRecording, 
    transcript, 
    suggestionBatches, 
    chatMessages,
    apiKey,
    settings,
    addSuggestionBatch,
    addChatMessage,
    getRecentTranscript,
    setApiKey
  } = useAppStore();
  
  const { startRecording, stopRecording, flushAudio } = useAudioRecorder();
  const [countdown, setCountdown] = useState(30);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const transcriptBodyRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const suggestionTimerRef = useRef<number | null>(null);

  // Check for API key on mount
  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, [apiKey]);

  const typeMapping: Record<string, string> = {
    'Question to Ask': 'question',
    'Talking Point': 'talking',
    'Answer': 'answer',
    'Fact Check': 'fact',
    'Clarification': 'question'
  };

  const labelFor = (type: string) => {
    const labels: Record<string, string> = {
      'Question to Ask': 'Question to ask',
      'Talking Point': 'Talking point',
      'Answer': 'Answer',
      'Fact Check': 'Fact-check',
      'Clarification': 'Question to ask'
    };
    return labels[type] || type;
  };

  const fetchSuggestions = async () => {
    if (!apiKey || transcript.length === 0) {
      console.log('Skipping suggestions: no API key or empty transcript');
      return;
    }
    
    console.log('Fetching suggestions... transcript chunks:', transcript.length);
    setIsLoadingSuggestions(true);
    try {
      await flushAudio();
      const recentTranscript = getRecentTranscript(settings.suggestionContextWindow);
      
      console.log('Recent transcript length:', recentTranscript.length, 'chars');
      
      if (!recentTranscript || recentTranscript.trim().length < 50) {
        console.log('Transcript too short for suggestions:', recentTranscript.length);
        return;
      }
      
      console.log('Calling generateSuggestions API...');
      const suggestions = await generateSuggestions(recentTranscript, apiKey, settings.suggestionPrompt);
      
      console.log('Received suggestions:', suggestions);
      
      if (suggestions && suggestions.length > 0) {
        addSuggestionBatch({
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          items: suggestions
        });
        console.log('Added suggestion batch with', suggestions.length, 'suggestions');
      } else {
        console.log('No suggestions returned from API');
      }
    } catch (error: any) {
      console.error('Failed to fetch suggestions:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleMicClick = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!isRecording) {
      try {
        await startRecording();
        toggleRecording();
        
        // Start countdown timer
        countdownTimerRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              fetchSuggestions();
              return 30;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Auto-fetch suggestions every 30 seconds
        suggestionTimerRef.current = setInterval(fetchSuggestions, 30000);
      } catch (error) {
        console.error('Failed to start recording:', error);
        alert('Failed to access microphone. Please check permissions.');
      }
    } else {
      stopRecording();
      toggleRecording();
      
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
    }
  };

  const handleReloadClick = () => {
    if (!isRecording) return;
    fetchSuggestions();
    setCountdown(30);
  };

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: `${suggestion.title}\n\n${suggestion.preview}`,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMessage);
    
    const recentTranscript = getRecentTranscript(settings.chatContextWindow);
    const systemPrompt = settings.clickPrompt;
    const userPrompt = `Full transcript context:\n${recentTranscript}\n\nThe user clicked this suggestion:\nType: ${suggestion.type}\nTitle: ${suggestion.title}\nPreview: ${suggestion.preview}\n\nProvide a detailed, immediately useful expansion of this suggestion.`;
    
    try {
      const response = await sendChatMessage(
        [{ role: 'user', content: userPrompt }],
        recentTranscript,
        apiKey,
        systemPrompt
      );
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Failed to expand suggestion:', error);
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.response?.data?.message || error.message || 'Failed to expand suggestion'}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || !apiKey) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMessage);
    setChatInput('');
    
    try {
      const recentTranscript = getRecentTranscript(settings.chatContextWindow);
      const response = await sendChatMessage(
        [{ role: 'user', content: text }],
        recentTranscript,
        apiKey,
        settings.chatPrompt
      );
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Failed to send message:', error);
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.response?.data?.message || error.message || 'Failed to send message'}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  useEffect(() => {
    if (transcriptBodyRef.current) {
      transcriptBodyRef.current.scrollTop = transcriptBodyRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Enter Groq API Key</h2>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
              You need a Groq API key to use TwinMind. Get one at <a href="https://console.groq.com" target="_blank" style={{ color: 'var(--accent)' }}>console.groq.com</a>
            </p>
            <input
              type="password"
              placeholder="gsk_..."
              style={{
                width: '100%',
                background: 'var(--panel-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '16px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    setApiKey(input.value.trim());
                    setShowApiKeyModal(false);
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                if (input?.value.trim()) {
                  setApiKey(input.value.trim());
                  setShowApiKeyModal(false);
                }
              }}
              style={{
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                width: '100%'
              }}
            >
              Save API Key
            </button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--panel)'
      }}>
        <h1 style={{ fontSize: '14px', fontWeight: 600, margin: 0, letterSpacing: '0.3px' }}>
          TwinMind — Live Suggestions
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            3-column layout · Transcript · Live Suggestions · Chat
          </div>
          <button
            onClick={() => {
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
            }}
            style={{
              background: 'var(--panel-2)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            📥 Export
          </button>
          <button
            onClick={() => setShowApiKeyModal(true)}
            style={{
              background: 'var(--panel-2)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            ⚙️ API Key
          </button>
        </div>
      </div>

      {/* Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        padding: '12px',
        height: 'calc(100vh - 46px)'
      }}>
        {/* Column 1: Mic & Transcript */}
        <div style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <header style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>1. Mic & Transcript</span>
            <span>{isRecording ? '● recording' : 'idle'}</span>
          </header>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px',
            borderBottom: '1px solid var(--border)'
          }}>
            <button
              onClick={handleMicClick}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: isRecording ? 'var(--danger)' : 'var(--accent)',
                color: isRecording ? '#fff' : '#000',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                animation: isRecording ? 'pulse 1.4s infinite' : 'none'
              }}
              title="Start / stop recording"
            >
              ●
            </button>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {isRecording ? 'Listening… transcript updates every 30s.' : 'Click mic to start recording'}
            </div>
          </div>
          
          <div ref={transcriptBodyRef} style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {transcript.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '30px 10px', lineHeight: 1.5 }}>
                No transcript yet — start the mic.
              </div>
            ) : (
              transcript.map((chunk) => (
                <div key={chunk.id} style={{
                  fontSize: '14px',
                  lineHeight: 1.55,
                  marginBottom: '10px',
                  color: '#cfd3dc',
                  animation: 'fadein 0.4s ease-out'
                }}>
                  <span style={{ color: 'var(--muted)', fontSize: '11px', marginRight: '6px' }}>
                    {new Date(chunk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {chunk.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Live Suggestions */}
        <div style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <header style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>2. Live Suggestions</span>
            <span>{suggestionBatches.length} batch{suggestionBatches.length === 1 ? '' : 'es'}</span>
          </header>
          
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button
              onClick={handleReloadClick}
              disabled={isLoadingSuggestions}
              style={{
                background: 'var(--panel-2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: isLoadingSuggestions ? 'not-allowed' : 'pointer',
                opacity: isLoadingSuggestions ? 0.5 : 1
              }}
            >
              {isLoadingSuggestions ? '⏳ Loading...' : '↻ Reload suggestions'}
            </button>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>
              auto-refresh in {countdown}s
            </span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {suggestionBatches.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '30px 10px', lineHeight: 1.5 }}>
                Suggestions appear here once recording starts.
              </div>
            ) : (
              suggestionBatches.map((batch, batchIndex) => (
                <div key={batch.id}>
                  {batch.items.map((sug, idx) => {
                    const mappedType = typeMapping[sug.type] || 'question';
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(sug)}
                        style={{
                          border: batchIndex === 0 ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: 'var(--panel-2)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '10px',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s, transform 0.15s',
                          opacity: batchIndex === 0 ? 1 : 0.55
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = batchIndex === 0 ? 'var(--accent)' : 'var(--border)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <span style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginBottom: '6px',
                          background: mappedType === 'question' ? 'rgba(110, 168, 254, 0.15)' :
                                     mappedType === 'talking' ? 'rgba(179, 136, 255, 0.15)' :
                                     mappedType === 'answer' ? 'rgba(74, 222, 128, 0.15)' :
                                     'rgba(251, 191, 36, 0.15)',
                          color: mappedType === 'question' ? 'var(--accent)' :
                                 mappedType === 'talking' ? 'var(--accent-2)' :
                                 mappedType === 'answer' ? 'var(--good)' :
                                 'var(--warn)'
                        }}>
                          {labelFor(sug.type)}
                        </span>
                        <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.4 }}>
                          {sug.title}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{
                    fontSize: '10px',
                    color: 'var(--muted)',
                    textAlign: 'center',
                    padding: '6px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    — Batch {suggestionBatches.length - batchIndex} · {new Date(batch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} —
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Chat */}
        <div style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <header style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>3. Chat (detailed answers)</span>
            <span>session-only</span>
          </header>
          
          <div ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {chatMessages.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '30px 10px', lineHeight: 1.5 }}>
                Click a suggestion or type a question below.
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: '14px' }}>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '4px'
                  }}>
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div style={{
                    background: msg.role === 'user' ? 'rgba(110, 168, 254, 0.08)' : 'var(--panel-2)',
                    border: msg.role === 'user' ? '1px solid rgba(110, 168, 254, 0.3)' : '1px solid var(--border)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{
            padding: '10px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
              style={{
                flex: 1,
                background: 'var(--panel-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={handleSendMessage}
              style={{
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
