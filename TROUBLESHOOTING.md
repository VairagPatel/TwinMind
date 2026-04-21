# Troubleshooting Guide

Common issues and their solutions.

## Table of Contents
1. [Setup Issues](#setup-issues)
2. [Recording Issues](#recording-issues)
3. [Transcription Issues](#transcription-issues)
4. [Suggestion Issues](#suggestion-issues)
5. [Chat Issues](#chat-issues)
6. [Deployment Issues](#deployment-issues)
7. [Performance Issues](#performance-issues)

---

## Setup Issues

### Backend won't start

**Error**: `Failed to start TwinmindApplication`

**Solutions**:
```bash
# Check Java version (need 17+)
java --version

# Clean and rebuild
cd backend
mvn clean install -DskipTests

# Check for port conflicts
# Windows:
netstat -ano | findstr :8080
# Mac/Linux:
lsof -i :8080

# Kill process using port 8080 if needed
# Windows:
taskkill /PID <PID> /F
# Mac/Linux:
kill -9 <PID>

# Try running again
mvn spring-boot:run
```

### Frontend won't start

**Error**: `Cannot find module` or `ENOENT`

**Solutions**:
```bash
# Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check Node version (need 18+)
node --version

# Try running again
npm run dev
```

### Maven dependencies won't download

**Error**: `Could not resolve dependencies`

**Solutions**:
```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Force update
mvn clean install -U

# Check internet connection
ping maven.apache.org

# Try different Maven mirror (edit ~/.m2/settings.xml)
```

---

## Recording Issues

### Microphone access denied

**Error**: `NotAllowedError: Permission denied`

**Solutions**:
1. Click the lock icon in browser address bar
2. Set microphone permission to "Allow"
3. Refresh the page
4. Try again

**Chrome**: Settings → Privacy and security → Site Settings → Microphone
**Firefox**: Settings → Privacy & Security → Permissions → Microphone
**Safari**: Safari → Settings → Websites → Microphone

### No microphone detected

**Error**: `NotFoundError: Requested device not found`

**Solutions**:
1. Check microphone is plugged in
2. Check microphone is not muted
3. Test microphone in system settings
4. Try different browser
5. Restart browser
6. Restart computer

### Recording starts but no audio captured

**Symptoms**: Recording indicator shows, but no transcript appears

**Solutions**:
1. Check microphone volume in system settings
2. Speak louder or closer to microphone
3. Check browser console for errors (F12)
4. Try different microphone
5. Check audio input device in system settings

---

## Transcription Issues

### Transcription fails immediately

**Error**: `Transcription failed: 401 Unauthorized`

**Solutions**:
1. Check Groq API key is correct
2. Verify API key has credits
3. Check API key hasn't expired
4. Get new API key from https://console.groq.com

### Transcription is very slow

**Symptoms**: Takes more than 10 seconds to appear

**Solutions**:
1. Check internet connection speed
2. Check Groq API status: https://status.groq.com
3. Try shorter audio chunks (edit `useAudioRecorder.ts`)
4. Check backend logs for delays

### Transcription is inaccurate

**Symptoms**: Wrong words, gibberish, or missing words

**Solutions**:
1. Speak more clearly and slowly
2. Reduce background noise
3. Use better microphone
4. Check audio quality in system settings
5. Try different language model (if available)

### Transcription is empty

**Error**: `Not enough transcript data yet`

**Solutions**:
1. Speak for at least 30 seconds
2. Check microphone is working
3. Check audio blob size in console
4. Verify audio is being captured (check waveform animation)

---

## Suggestion Issues

### Suggestions not generating

**Error**: `Could not load suggestions`

**Solutions**:
1. Ensure transcript has at least 50 characters
2. Check API key is valid
3. Check API key has credits
4. Wait full 60 seconds after starting recording
5. Click manual refresh button
6. Check browser console for errors
7. Check backend logs

### Suggestions are generic/not relevant

**Symptoms**: Suggestions don't match conversation

**Solutions**:
1. Increase context window in Settings (default: 3000 chars)
2. Speak for longer before expecting suggestions
3. Customize suggestion prompt in Settings
4. Check transcript is accurate first
5. Try different conversation topics

### Suggestions fail to parse

**Error**: `Failed to parse suggestions: Unexpected token`

**Solutions**:
1. Check backend logs for full error
2. Test prompt in Groq playground
3. Simplify custom prompt if using one
4. Reset to default prompt in Settings
5. Check LLM is returning valid JSON

### Suggestions refresh too often/not often enough

**Solutions**:
1. Open Settings
2. Adjust "Refresh Interval" (default: 30 seconds)
3. Save settings
4. Restart recording

---

## Chat Issues

### Chat not responding

**Error**: `Chat failed: Network Error`

**Solutions**:
1. Check internet connection
2. Check backend is running
3. Check API key is valid
4. Check browser console for CORS errors
5. Verify backend URL in .env

### Chat responses are slow

**Symptoms**: Takes more than 10 seconds

**Solutions**:
1. Check internet connection speed
2. Check Groq API status
3. Reduce context window in Settings
4. Check backend logs for delays
5. Try different LLM model

### Chat responses are not contextual

**Symptoms**: AI doesn't seem to know about conversation

**Solutions**:
1. Increase chat context window in Settings (default: 6000 chars)
2. Ensure transcript has content
3. Check transcript is accurate
4. Customize chat prompt in Settings
5. Ask more specific questions

### Chat shows error messages

**Error**: Various error messages in chat

**Solutions**:
1. Check specific error message
2. Verify API key is valid
3. Check API rate limits
4. Check backend logs
5. Try again after a few seconds

---

## Deployment Issues

### Backend deployment fails

**Error**: Build fails on Render/Railway

**Solutions**:
```bash
# Test build locally first
cd backend
mvn clean install

# Check Java version matches deployment (17)
java --version

# Check pom.xml for errors
# Verify all dependencies are available

# Check deployment logs for specific error
# Common issues:
# - Wrong Java version
# - Missing dependencies
# - Port binding issues
```

### Frontend deployment fails

**Error**: Build fails on Vercel

**Solutions**:
```bash
# Test build locally first
cd frontend
npm run build

# Check Node version matches deployment (18)
node --version

# Check for TypeScript errors
npm run build

# Verify environment variables are set
# Check Vercel deployment logs
```

### CORS errors after deployment

**Error**: `Access-Control-Allow-Origin` error

**Solutions**:
1. Check `ALLOWED_ORIGIN` in backend env vars
2. Ensure it matches frontend URL exactly
3. No trailing slashes
4. Include protocol (https://)
5. Redeploy backend after changing
6. Clear browser cache

### API calls fail after deployment

**Error**: `Failed to fetch` or `Network Error`

**Solutions**:
1. Check `VITE_API_BASE_URL` in frontend env vars
2. Ensure it matches backend URL exactly
3. Include protocol (https://)
4. No trailing slashes
5. Redeploy frontend after changing
6. Check backend is actually running
7. Test backend health endpoint directly

---

## Performance Issues

### App is slow/laggy

**Symptoms**: UI freezes, slow responses

**Solutions**:
1. Close other browser tabs
2. Restart browser
3. Clear browser cache
4. Check CPU usage in Task Manager
5. Try different browser
6. Reduce context windows in Settings
7. Increase refresh interval in Settings

### High memory usage

**Symptoms**: Browser uses lots of RAM

**Solutions**:
1. Export and restart session periodically
2. Reduce context windows
3. Clear old suggestion batches (refresh page)
4. Close other tabs
5. Use Chrome Task Manager to identify leaks

### Audio recording is choppy

**Symptoms**: Waveform stutters, audio cuts out

**Solutions**:
1. Close other applications
2. Check CPU usage
3. Try different browser
4. Reduce audio quality (edit `useAudioRecorder.ts`)
5. Check microphone drivers are updated

---

## Debug Mode

### Enable verbose logging

**Backend**:
Edit `application.properties`:
```properties
logging.level.com.twinmind=DEBUG
logging.level.org.springframework.web=DEBUG
```

**Frontend**:
Open browser console (F12) and check:
- Network tab for API calls
- Console tab for errors
- Application tab for localStorage

### Test API endpoints directly

**Transcribe**:
```bash
curl -X POST http://localhost:8080/api/transcribe \
  -H "X-API-Key: your_groq_key" \
  -F "audio=@test.webm"
```

**Suggestions**:
```bash
curl -X POST http://localhost:8080/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "This is a test transcript",
    "apiKey": "your_groq_key"
  }'
```

**Chat**:
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "transcript": "Test transcript",
    "apiKey": "your_groq_key"
  }'
```

---

## Getting Help

### Check logs

**Backend logs**:
- Local: Check terminal where `mvn spring-boot:run` is running
- Render: Dashboard → Logs
- Railway: Dashboard → Deployments → View Logs

**Frontend logs**:
- Browser console (F12)
- Vercel: Dashboard → Deployments → Function Logs

### Useful commands

```bash
# Check if backend is running
curl http://localhost:8080/api/health

# Check frontend build
cd frontend && npm run build

# Check backend build
cd backend && mvn clean install

# View backend logs
cd backend && mvn spring-boot:run

# View frontend logs
cd frontend && npm run dev
```

### Report an issue

When reporting issues, include:
1. Operating system and version
2. Browser and version
3. Node.js version
4. Java version
5. Error message (full text)
6. Steps to reproduce
7. Screenshots if applicable
8. Browser console logs
9. Backend logs

### Resources

- Groq API Docs: https://console.groq.com/docs
- Spring Boot Docs: https://spring.io/projects/spring-boot
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind Docs: https://tailwindcss.com

---

## Still Having Issues?

1. Read through [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details
2. Check [QUICKSTART.md](QUICKSTART.md) for setup steps
3. Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
4. Search GitHub issues (if open source)
5. Contact support (if applicable)

## Common Gotchas

1. **API Key**: Must be valid Groq API key, not OpenAI
2. **HTTPS**: Required for microphone access (except localhost)
3. **CORS**: Backend and frontend URLs must match exactly
4. **Context Windows**: Too large = expensive, too small = not useful
5. **Refresh Interval**: Too short = expensive, too long = stale
6. **Audio Format**: Must be WebM or WAV
7. **Browser**: Chrome/Edge work best, Safari has issues
8. **Microphone**: Must grant permission every time on some browsers
9. **Transcript**: Need at least 50 chars before suggestions work
10. **JSON Parsing**: LLM must return valid JSON for suggestions
