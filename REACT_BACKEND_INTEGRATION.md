# React Frontend with Backend Integration

## ✅ What Changed

The React frontend now uses **real backend data** instead of demo data, while maintaining the exact same styling as the HTML prototype.

## 🎯 Features

### Real Backend Integration
- ✅ Real microphone recording via Web Audio API
- ✅ Real transcription using Groq Whisper API
- ✅ Real AI-generated suggestions using Groq LLM
- ✅ Real chat responses from Groq
- ✅ Persistent API key storage in localStorage

### Same Styling as HTML Prototype
- ✅ Exact same colors (CSS variables)
- ✅ Same 3-column layout (33% / 33% / 33%)
- ✅ Same topbar design
- ✅ Same mic button with pulse animation
- ✅ Same suggestion card styling
- ✅ Same chat bubble design
- ✅ Same fonts, spacing, and borders

## 🚀 How to Use

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### 3. Enter API Key
- On first load, you'll see an API key modal
- Get your Groq API key from: https://console.groq.com
- Enter the key and click "Save API Key"
- The key is stored in localStorage

### 4. Start Recording
- Click the blue mic button (●)
- Allow microphone access when prompted
- Speak naturally - audio is transcribed every 30 seconds
- Transcript appears in the left column

### 5. View Suggestions
- Suggestions auto-generate every 30 seconds while recording
- Click "↻ Reload suggestions" for immediate refresh
- Fresh batch is highlighted with blue border
- Older batches are faded (55% opacity)

### 6. Use Chat
- Click any suggestion card to expand it in chat
- Or type your own questions in the chat input
- Press Enter or click Send
- AI responds with detailed answers

## 🔧 Configuration

### API Key Management
- Click "⚙️ API Key" button in top-right to change key
- Key is stored in browser localStorage
- Each user needs their own Groq API key

### Backend URL
Default: `http://localhost:8080`

To change, create `.env` file in `frontend/`:
```
VITE_API_BASE_URL=http://your-backend-url:port
```

## 📊 Data Flow

### Transcription Flow
1. User clicks mic button
2. Browser captures audio via MediaRecorder
3. Audio chunks collected every 5 seconds
4. Every 30 seconds, audio sent to backend `/api/transcribe`
5. Backend forwards to Groq Whisper API
6. Transcribed text added to transcript column

### Suggestions Flow
1. Every 30 seconds (or manual reload)
2. Recent transcript sent to backend `/api/suggestions`
3. Backend uses Groq LLM to generate 3 suggestions
4. Suggestions displayed as cards with type tags
5. New batch highlighted, old batches faded

### Chat Flow
1. User clicks suggestion or types message
2. Message sent to backend `/api/chat`
3. Backend includes full transcript context
4. Groq LLM generates detailed response
5. Response displayed in chat column

## 🎨 Styling Details

### Color Palette
- Background: `#0f1115`
- Panel: `#171a21`
- Panel-2: `#1d212a`
- Border: `#272c38`
- Text: `#e7e9ee`
- Muted: `#8a93a6`
- Accent (Blue): `#6ea8fe`
- Accent-2 (Purple): `#b388ff`
- Good (Green): `#4ade80`
- Warn (Yellow): `#fbbf24`
- Danger (Red): `#ef4444`

### Tag Colors
- Question to ask → Blue (`#6ea8fe`)
- Talking point → Purple (`#b388ff`)
- Answer → Green (`#4ade80`)
- Fact-check → Yellow (`#fbbf24`)

### Animations
- Pulse effect on recording mic button (1.4s infinite)
- Fade-in for new transcript lines (0.4s ease-out)
- Hover effects on suggestion cards

## 🔄 State Management

Uses Zustand store (`useAppStore`) for:
- API key
- Recording state
- Transcript chunks
- Suggestion batches
- Chat messages
- Settings (prompts, context windows)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Axios** - HTTP client
- **Vite** - Build tool & dev server
- **Web Audio API** - Microphone recording
- **Inline styles** - Matches HTML prototype exactly

## 📝 API Endpoints

### POST /api/transcribe
- Body: FormData with audio file
- Headers: `X-API-Key: <groq-key>`
- Returns: `{ text: string }`

### POST /api/suggestions
- Body: `{ transcript, apiKey, customPrompt? }`
- Returns: `{ suggestions: Suggestion[] }`

### POST /api/chat
- Body: `{ messages, transcript, apiKey, customSystemPrompt? }`
- Returns: `{ content: string }`

## 🐛 Troubleshooting

### "Failed to access microphone"
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

### "API Key required"
- Click "⚙️ API Key" button
- Enter valid Groq API key
- Key format: `gsk_...`

### Backend connection failed
- Ensure backend is running on port 8080
- Check CORS configuration
- Verify API_BASE_URL in .env

### No suggestions appearing
- Ensure you have transcript data
- Check browser console for errors
- Verify Groq API key is valid
- Check backend logs

## 🎯 Differences from HTML Prototype

### What's the Same
- ✅ All visual styling
- ✅ Layout and spacing
- ✅ Colors and fonts
- ✅ Animations
- ✅ User interactions

### What's Different
- ✅ Uses real backend instead of demo data
- ✅ Real microphone recording
- ✅ Real AI transcription and suggestions
- ✅ API key management
- ✅ Error handling
- ✅ Loading states

## 📦 Files Modified

- `frontend/src/App.tsx` - Main component with backend integration
- `frontend/src/index.css` - CSS variables and animations
- Kept existing:
  - `frontend/src/api/groqClient.ts` - API client
  - `frontend/src/hooks/useAudioRecorder.ts` - Audio recording
  - `frontend/src/store/useAppStore.ts` - State management
  - `frontend/src/types/index.ts` - TypeScript types

## 🚀 Next Steps

1. Test with real microphone input
2. Verify backend is running
3. Enter your Groq API key
4. Start recording and speaking
5. Watch suggestions appear automatically
6. Click suggestions to expand in chat
7. Ask follow-up questions

The React frontend now has the exact same look and feel as the HTML prototype, but with full backend integration and real AI capabilities!
