# TwinMind Setup Guide

## Current Status

✅ Frontend running on: http://localhost:5173  
✅ Backend running on: http://localhost:8080  

## ⚠️ Error You're Seeing

```
Failed to load resource: the server responded with a status of 500
Transcription failed: AxiosError: Request failed with status code 500
```

This error means the backend received your request but couldn't process it. Most likely cause: **Missing or invalid Groq API key**.

## 🔑 Step 1: Get a Groq API Key

1. Go to: https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)

## 🚀 Step 2: Enter API Key in Frontend

1. Open http://localhost:5173 in your browser
2. You should see an API key modal
3. Paste your Groq API key
4. Click "Save API Key"

If you don't see the modal:
- Click the "⚙️ API Key" button in the top-right corner
- Enter your key there

## 🎤 Step 3: Test the Application

1. Click the blue mic button (●) to start recording
2. Allow microphone access when prompted
3. Speak clearly into your microphone
4. Wait 30 seconds for the first transcription
5. Transcript will appear in the left column
6. Suggestions will auto-generate in the middle column

## 🐛 Troubleshooting

### "Failed to access microphone"
- **Solution**: Check browser permissions
- Chrome: Click the lock icon in address bar → Site settings → Microphone → Allow
- Firefox: Click the shield icon → Permissions → Microphone → Allow
- Must use HTTPS or localhost

### "Request failed with status code 500"
- **Cause**: Invalid or missing API key
- **Solution**: 
  1. Click "⚙️ API Key" button
  2. Enter a valid Groq API key (starts with `gsk_...`)
  3. Try recording again

### "Backend connection failed" or "Network Error"
- **Cause**: Backend not running
- **Solution**: 
  ```bash
  cd backend
  mvn spring-boot:run
  ```
- Wait for "Started TwinmindApplication" message
- Backend should be on port 8080

### No transcript appearing
- **Check**: Are you speaking loud enough?
- **Check**: Is microphone working? (test in system settings)
- **Check**: Wait full 30 seconds for first transcription
- **Check**: Look in browser console (F12) for error messages

### No suggestions appearing
- **Check**: Do you have transcript data first?
- **Check**: Wait 30 seconds after transcript appears
- **Check**: Click "↻ Reload suggestions" manually
- **Check**: Browser console for errors

## 📊 How It Works

### Audio Flow
1. Browser captures audio via MediaRecorder API
2. Audio chunks collected every 5 seconds
3. Every 30 seconds, audio sent to backend
4. Backend forwards to Groq Whisper API
5. Transcribed text appears in left column

### Suggestions Flow
1. Every 30 seconds (or manual reload)
2. Recent transcript sent to backend
3. Backend uses Groq LLM to generate 3 suggestions
4. Suggestions appear as cards in middle column
5. Fresh batch highlighted, old batches faded

### Chat Flow
1. Click suggestion or type message
2. Message sent to backend with full transcript context
3. Backend uses Groq LLM for detailed response
4. Response appears in right column

## 🎨 UI Features

### Column 1 - Mic & Transcript
- Blue mic button → Click to start recording
- Red pulsing mic → Currently recording
- Transcript lines show with timestamps
- Auto-scrolls to bottom

### Column 2 - Live Suggestions
- 3 suggestions per batch
- Color-coded tags:
  - Blue = Question to ask
  - Purple = Talking point
  - Green = Answer
  - Yellow = Fact-check
- Fresh batch has blue border
- Old batches are faded (55% opacity)
- Click any card to expand in chat

### Column 3 - Chat
- Click suggestions to add to chat
- Type your own questions
- Press Enter or click Send
- AI responds with detailed answers
- User messages have blue tint
- Assistant messages are neutral

## 🔧 Configuration

### Change Backend URL
Create `frontend/.env`:
```
VITE_API_BASE_URL=http://your-backend-url:port
```

### Change API Models
Edit `backend/src/main/java/com/twinmind/service/GroqService.java`:
```java
private static final String WHISPER_MODEL = "whisper-large-v3";
private static final String CHAT_MODEL = "llama-3.3-70b-versatile";
```

### Change Prompts
Click "⚙️ API Key" → Settings (future feature)
Or edit `frontend/src/types/index.ts` → `DEFAULT_SETTINGS`

## ✅ Verification Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Valid Groq API key entered
- [ ] Microphone permission granted
- [ ] Can see mic button
- [ ] Mic button turns red when clicked
- [ ] Transcript appears after 30 seconds
- [ ] Suggestions appear after transcript
- [ ] Can click suggestions
- [ ] Chat responses appear

## 📝 Next Steps

Once everything is working:

1. **Test transcription**: Speak naturally and wait for text
2. **Test suggestions**: Wait for auto-generated suggestions
3. **Test chat**: Click a suggestion to expand it
4. **Test manual chat**: Type your own questions
5. **Test reload**: Click "↻ Reload suggestions"

## 🆘 Still Having Issues?

Check the browser console (F12) for detailed error messages:
- Red errors = Something is broken
- Yellow warnings = Usually safe to ignore
- Blue info = Normal operation

Common console messages:
- "Uploading audio chunk: X bytes" = Good, audio is being sent
- "Transcription successful: ..." = Good, transcription working
- "Empty transcription result" = Silence detected, speak louder
- "Transcription failed: ..." = Check API key or backend

## 🎯 Expected Behavior

**First 30 seconds:**
- Mic button is red and pulsing
- No transcript yet (collecting audio)
- No suggestions yet

**After 30 seconds:**
- First transcript line appears
- Console shows "Transcription successful"

**After 60 seconds:**
- Second transcript line appears
- First suggestion batch appears
- 3 cards with colored tags

**Ongoing:**
- New transcript every 30s
- New suggestions every 30s
- Can click suggestions anytime
- Can type chat messages anytime

## 🚀 You're All Set!

Once you see transcript and suggestions appearing, the app is working correctly. Enjoy using TwinMind!
