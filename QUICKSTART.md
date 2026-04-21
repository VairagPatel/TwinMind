# Quick Start Guide

Get TwinMind running in 5 minutes!

## Step 1: Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check Java (need 17+)
java --version

# Check Maven (need 3.8+)
mvn --version
```

If any are missing, install them first.

## Step 2: Get a Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy it (you'll need it in Step 5)

## Step 3: Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (Maven will auto-download dependencies)
cd ../backend
mvn clean install
```

## Step 4: Configure Environment

```bash
# Create frontend .env file
cd frontend
cp .env.example .env

# The .env should contain:
# VITE_API_BASE_URL=http://localhost:8080
```

## Step 5: Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

Wait for "Started TwinmindApplication" message.

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 6: Use the App

1. Open http://localhost:5173 in your browser
2. Click the gear icon (⚙️) in the top right
3. Paste your Groq API key
4. Click "Save"
5. Click "Start Recording"
6. Allow microphone access when prompted
7. Start talking!

## What to Expect

- **After ~30 seconds**: Your speech appears as text in the left panel
- **After ~60 seconds**: 3 AI suggestions appear in the middle panel
- **Click a suggestion**: Get a detailed response in the right chat panel
- **Type in chat**: Ask questions about your conversation

## Troubleshooting

### "Failed to access microphone"
- Check browser permissions (click lock icon in address bar)
- Try Chrome or Edge (best compatibility)
- Ensure you're on localhost or HTTPS

### "Transcription failed"
- Verify your Groq API key is correct
- Check you have API credits remaining
- Look at backend terminal for error messages

### "Could not load suggestions"
- Ensure you've spoken for at least 30 seconds
- Check transcript has text in the left panel
- Verify API key in Settings

### Backend won't start
```bash
# Clean and rebuild
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

### Frontend won't start
```bash
# Clean and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Next Steps

- Read [DEVELOPMENT.md](DEVELOPMENT.md) for detailed architecture
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Customize prompts in Settings to match your use case
- Export sessions to save your conversations

## Tips for Best Results

1. **Speak clearly** and at a normal pace
2. **Wait 30-60 seconds** before expecting suggestions
3. **Use good audio**: Quiet environment, decent microphone
4. **Longer conversations** = better suggestions
5. **Click suggestions** to get detailed expansions
6. **Adjust context windows** in Settings for different use cases

## Example Use Cases

- **Meetings**: Get real-time talking points and questions
- **Interviews**: Fact-check claims and generate follow-ups
- **Brainstorming**: Get suggestions to keep ideas flowing
- **Learning**: Ask clarifying questions about complex topics
- **Presentations**: Get audience questions you might face

## Support

- Check browser console (F12) for errors
- Check backend terminal for Java errors
- Review [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details
- Groq API docs: https://console.groq.com/docs

Enjoy using TwinMind! 🚀
