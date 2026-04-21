# Development Guide

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.8+
- Groq API Key ([Get one here](https://console.groq.com))

## Initial Setup

### 1. Clone and Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (Maven will handle this)
cd ../backend
mvn clean install
```

### 2. Configure Environment

```bash
# Frontend
cd frontend
cp .env.example .env
# Edit .env and set:
# VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start Development Servers

Terminal 1 (Backend):
```bash
cd backend
mvn spring-boot:run
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Project Structure

```
twinmind/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/twinmind/
│   │   ├── TwinmindApplication.java
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── controller/
│   │   │   ├── TranscribeController.java
│   │   │   ├── SuggestionsController.java
│   │   │   └── ChatController.java
│   │   ├── service/
│   │   │   ├── GroqService.java
│   │   │   └── PromptService.java
│   │   └── model/
│   │       ├── TranscribeResponse.java
│   │       ├── SuggestionRequest.java
│   │       ├── SuggestionResponse.java
│   │       ├── ChatRequest.java
│   │       ├── ChatResponse.java
│   │       └── ErrorResponse.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── SettingsModal.tsx
│   │   │   ├── TranscriptPanel.tsx
│   │   │   ├── SuggestionCard.tsx
│   │   │   ├── SuggestionsPanel.tsx
│   │   │   └── ChatPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useAudioRecorder.ts
│   │   │   └── useSuggestionRefresh.ts
│   │   ├── store/
│   │   │   └── useAppStore.ts
│   │   ├── api/
│   │   │   └── groqClient.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── README.md
├── DEPLOYMENT.md
└── DEVELOPMENT.md
```

## Key Technologies

### Backend
- **Spring Boot 3.2**: Modern Java framework
- **WebFlux**: Reactive HTTP client for Groq API calls
- **Lombok**: Reduces boilerplate code
- **Jackson**: JSON serialization/deserialization

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Zustand**: State management
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Axios**: HTTP client

## API Endpoints

### POST /api/transcribe
Transcribes audio using Groq Whisper Large V3.

**Request:**
- Header: `X-API-Key: <groq_api_key>`
- Body: `multipart/form-data` with `audio` file

**Response:**
```json
{
  "text": "transcribed text"
}
```

### POST /api/suggestions
Generates 3 contextual suggestions.

**Request:**
```json
{
  "transcript": "recent transcript text",
  "apiKey": "groq_api_key",
  "customPrompt": "optional custom prompt"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "type": "Question to Ask",
      "title": "...",
      "preview": "..."
    }
  ]
}
```

### POST /api/chat
Handles chat messages with context.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "..." }
  ],
  "transcript": "recent transcript",
  "apiKey": "groq_api_key",
  "customSystemPrompt": "optional"
}
```

**Response:**
```json
{
  "content": "AI response"
}
```

## State Management

The app uses Zustand for global state:

```typescript
interface AppStore {
  apiKey: string;
  isRecording: boolean;
  transcript: TranscriptChunk[];
  suggestionBatches: SuggestionBatch[];
  chatMessages: ChatMessage[];
  settings: Settings;
  // ... actions
}
```

## Audio Recording Flow

1. User clicks "Start Recording"
2. `useAudioRecorder` hook requests microphone access
3. `MediaRecorder` collects 5-second audio chunks
4. Every 30 seconds, chunks are combined and sent to backend
5. Backend forwards to Groq Whisper API
6. Transcription is added to transcript array
7. Auto-scrolls to show latest text

## Suggestion Generation Flow

1. Every 30 seconds (configurable), `useSuggestionRefresh` triggers
2. Flushes any pending audio first
3. Waits 2 seconds for transcription to complete
4. Sends last N characters of transcript to backend
5. Backend calls Groq LLM with suggestion prompt
6. Parses JSON response (retries once if parsing fails)
7. New suggestions are prepended to the list with animation

## Chat Flow

1. User clicks a suggestion or types a message
2. Message is added to chat history
3. For suggestions: uses click-expand prompt
4. For manual messages: uses chat system prompt
5. Backend calls Groq LLM with full context
6. Response is streamed back and displayed

## Customization

### Changing Models

Edit `backend/src/main/java/com/twinmind/service/GroqService.java`:

```java
private static final String CHAT_MODEL = "moonshotai/kimi-k2-instruct";
// Change to: "meta-llama/llama-3.3-70b-versatile"
```

### Adjusting Context Windows

Edit `frontend/src/types/index.ts`:

```typescript
export const DEFAULT_SETTINGS: Settings = {
  suggestionContextWindow: 3000,  // Increase for more context
  chatContextWindow: 6000,         // Increase for more context
  // ...
};
```

### Modifying Prompts

Prompts can be edited in the Settings modal or by changing defaults in:
- `frontend/src/types/index.ts` (frontend defaults)
- `backend/src/main/java/com/twinmind/service/PromptService.java` (backend defaults)

## Testing

### Manual Testing Checklist

- [ ] Microphone access granted
- [ ] Audio recording starts/stops
- [ ] Transcription appears in left panel
- [ ] Suggestions generate after 30s
- [ ] Clicking suggestion opens chat
- [ ] Manual chat messages work
- [ ] Settings can be changed
- [ ] Session export downloads JSON
- [ ] Error handling works (invalid API key, etc.)

### Testing with Mock Data

For testing without recording, you can manually add transcript chunks:

```typescript
// In browser console
useAppStore.getState().addTranscriptChunk({
  id: Date.now().toString(),
  text: "This is a test transcript",
  timestamp: new Date().toISOString()
});
```

## Common Issues

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS (required for getUserMedia)
- Try different browser

### Transcription Fails
- Verify API key is correct
- Check Groq API status
- Ensure audio blob is valid (check size > 1KB)

### Suggestions Not Generating
- Ensure transcript has at least 50 characters
- Check API key has credits
- Verify prompt returns valid JSON

### CORS Errors
- Check `ALLOWED_ORIGIN` in `application.properties`
- Ensure frontend URL matches exactly

## Performance Optimization

1. **Debounce Suggestion Requests**: Already implemented
2. **Lazy Load Chat History**: Consider pagination for long chats
3. **Compress Audio**: Use lower bitrate for smaller uploads
4. **Cache Transcriptions**: Store in localStorage for session recovery

## Future Enhancements

1. **WebSocket Streaming**: Real-time transcript updates
2. **Speaker Diarization**: Identify different speakers
3. **Meeting Summaries**: Auto-generate at end
4. **Search History**: Full-text search across sessions
5. **Collaborative Mode**: Multiple users in same session
6. **Mobile App**: React Native version
7. **Offline Mode**: Local transcription with Whisper.cpp
8. **Integration**: Calendar, Slack, Teams

## Contributing

This is a portfolio project, but feel free to fork and extend!

## License

MIT License - see LICENSE file for details
