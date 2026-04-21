# TwinMind Live Suggestions — AI Meeting Copilot

A production-quality AI meeting copilot web app that listens to live mic audio, transcribes it in real-time, and continuously surfaces 3 smart, contextual suggestions based on what's being said.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel]
- **Backend**: [Deployed on Render/Railway]

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** + **TypeScript** - Modern, fast development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **Axios** - HTTP client

### Backend
- **Spring Boot 3.x** - Robust Java backend
- **WebFlux** - Reactive streaming support
- **Maven** - Dependency management

### AI APIs (Groq)
- **Whisper Large V3** - Real-time transcription
- **openai/gpt-oss-120b** - Suggestions and chat (as required by assignment)

## 📋 Stack Rationale

This stack was chosen to align with my strongest technical skills:
- **React + Vite + Tailwind**: Used extensively in LumiAI and Figure N Fit projects
- **Spring Boot**: My primary backend expertise
- **Zustand + Framer Motion**: Already proven in LumiAI
- **Groq API**: Required by assignment, using Whisper Large V3 and kimi-k2-instruct (closest to 120B OSS requirement)

## 🧠 Prompt Strategy

### Live Suggestions Prompt
- **Context Window**: Last 3000 characters of transcript (configurable)
- **Strategy**: Instructs LLM to return exactly 3 suggestions with varied types
- **Key Innovation**: Preview text must deliver STANDALONE VALUE, not just tease
- **Type Selection**: Dynamic based on conversation context (Fact Check, Question, Talking Point, etc.)

### Click-to-Expand Prompt
- **Context Window**: Full transcript + clicked suggestion details
- **Strategy**: Provides detailed, structured expansion (400 words max)
- **Format**: Bullet points, key facts, immediately actionable

### Chat System Prompt
- **Context Window**: Last 6000 characters (configurable)
- **Strategy**: Grounded in actual transcript, honest about limitations
- **Format**: Readable with bullets and emphasis

### Tradeoffs
- **Context Windows**: Balanced between relevance and token cost
- **Refresh Interval**: 30s balances freshness vs API costs
- **No Streaming for Suggestions**: Ensures complete JSON parsing
- **Streaming for Chat**: Better UX for longer responses

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- Groq API Key ([Get one here](https://console.groq.com))

### Local Development

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:8080
npm run dev
# Runs on http://localhost:5173
```

### First Run
1. Open http://localhost:5173
2. Click the gear icon (Settings)
3. Enter your Groq API key
4. Click "Start Recording" to begin

### Deployment

#### Backend (Render/Railway)
1. Connect your GitHub repo
2. Set build command: `cd backend && mvn clean install`
3. Set start command: `java -jar target/twinmind-0.0.1-SNAPSHOT.jar`
4. Set environment variable: `ALLOWED_ORIGIN=https://your-frontend.vercel.app`

#### Frontend (Vercel)
1. Connect your GitHub repo
2. Set root directory: `frontend`
3. Set environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`
4. Deploy

## 🎯 Features

- ✅ Real-time audio transcription (30s chunks)
- ✅ Auto-refreshing AI suggestions every 30s
- ✅ 5 suggestion types: Question, Talking Point, Fact Check, Clarification, Answer
- ✅ Click-to-expand detailed responses
- ✅ Full chat interface with conversation context
- ✅ Customizable prompts and context windows
- ✅ Session export (JSON)
- ✅ Dark theme with smooth animations
- ✅ No database, no auth required

## 🔧 Known Limitations & Future Improvements

### Current Limitations
1. **No persistence**: Refresh loses session (mitigated by export feature)
2. **Client-side API key**: Should use backend proxy in production
3. **No speaker diarization**: Can't distinguish multiple speakers
4. **30s audio chunks**: Slight delay in transcription
5. **No retry logic**: Failed API calls require manual refresh

### Future Improvements
1. **WebSocket streaming**: Real-time transcript updates
2. **Backend API key management**: Secure key storage
3. **Session persistence**: PostgreSQL or Redis
4. **Speaker identification**: Groq doesn't support this yet, but could integrate another service
5. **Suggestion history search**: Full-text search across past suggestions
6. **Meeting summaries**: Auto-generate at end of session
7. **Multi-language support**: Whisper supports 90+ languages
8. **Mobile responsive**: Currently optimized for desktop
9. **Collaborative mode**: Multiple users in same session
10. **Integration with calendar**: Auto-start recording for scheduled meetings

## 📁 Project Structure

```
twinmind/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   └── package.json
├── backend/           # Spring Boot app
│   ├── src/main/java/com/twinmind/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   └── config/
│   └── pom.xml
└── README.md
```

## 🤝 Contributing

This is a portfolio project for a technical interview. Not accepting contributions at this time.

## 📄 License

MIT License - feel free to use this as a reference for your own projects.

## 🙏 Acknowledgments

- Inspired by [TwinMind](https://twinmind.ai)
- Powered by [Groq](https://groq.com) for blazing-fast inference
- Built with ❤️ using React, Spring Boot, and modern web technologies
