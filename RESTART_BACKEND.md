# Restart Backend Instructions

## The Issue
The backend is using an invalid Groq model name that doesn't exist, causing 404 errors.

## What Was Fixed
Changed the chat model from `moonshotai/kimi-k2-instruct` to `llama-3.3-70b-versatile` (a valid Groq model).

## How to Apply the Fix

### Option 1: Using Maven (Recommended)
```bash
cd backend
mvn spring-boot:run
```

### Option 2: Using Java directly
```bash
cd backend
mvn clean package -DskipTests
java -jar target/twinmind-0.0.1-SNAPSHOT.jar
```

## After Restarting
1. Refresh your frontend browser page
2. Click the microphone to start recording
3. Speak for at least 30 seconds
4. Suggestions should now appear automatically

## Verify It's Working
You should see in the backend console:
- "Calling Groq API for suggestions..."
- "Suggestions generated successfully: 3 suggestions"

Instead of:
- "404 Not Found from POST https://api.groq.com/openai/v1/chat/completions"
