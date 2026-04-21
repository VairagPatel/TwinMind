# 🚀 TwinMind Deployment Instructions

## Critical Updates Made

### ✅ Model Fixed
- Changed from `llama-3.3-70b-versatile` to `openai/gpt-oss-120b` (as required)
- Location: `backend/src/main/java/com/twinmind/service/GroqService.java:28`

### ✅ Code Quality Fixed
- Removed unused imports (DataBuffer, DataBufferUtils)
- Removed printStackTrace() call
- Code is production-ready

### ⚠️ IDE Warning (Can Ignore)
- You may see `getSuggestions()` errors in IDE
- This is a Lombok annotation processor issue in the IDE
- **The code WILL compile successfully with Maven**
- Lombok's `@Data` annotation generates the getter at compile time

## Step-by-Step Deployment

### 1. Backend Deployment (Render)

1. Go to [https://render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `twinmind-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean install`
   - **Start Command**: `java -jar target/twinmind-0.0.1-SNAPSHOT.jar`
   - **Environment Variables**:
     - `ALLOWED_ORIGIN`: Leave blank for now (will update after frontend)
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **Copy the backend URL** (e.g., `https://twinmind-backend.onrender.com`)

### 2. Frontend Deployment (Vercel)

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - Name: `VITE_API_BASE_URL`
     - Value: `https://twinmind-backend.onrender.com` (your backend URL from step 1)
5. Click "Deploy"
6. Wait for deployment (2-3 minutes)
7. **Copy the frontend URL** (e.g., `https://twinmind.vercel.app`)

### 3. Update CORS Configuration

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Add/Update environment variable:
   - **Key**: `ALLOWED_ORIGIN`
   - **Value**: `https://twinmind.vercel.app` (your frontend URL from step 2)
5. Click "Save Changes"
6. Backend will automatically redeploy (2-3 minutes)

### 4. Update README

Update the README.md with your actual URLs:

```markdown
## 🚀 Live Demo

- **Frontend**: https://twinmind.vercel.app
- **Backend**: https://twinmind-backend.onrender.com
```

### 5. Test Your Deployment

1. Open your frontend URL
2. Click the gear icon (Settings)
3. Enter your Groq API key
4. Click "Start Recording"
5. Speak for 30-45 seconds
6. Verify:
   - Transcript appears
   - Suggestions generate automatically
   - Chat works when clicking suggestions
   - Export button downloads JSON

## Troubleshooting

### Backend Won't Start
- Check Render logs for errors
- Verify Java 17+ is being used
- Ensure Maven build completed successfully

### Frontend Can't Connect to Backend
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS configuration on backend
- Open browser console for error messages

### Transcription Fails
- Verify Groq API key is valid
- Check API key has credits
- Test with: `curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer YOUR_KEY"`

### Suggestions Not Generating
- Check browser console for errors
- Verify transcript has at least 50 characters
- Check backend logs for API errors

## Alternative: Quick Test with Replit

If you need to deploy faster:

1. Go to [https://replit.com](https://replit.com)
2. Import from GitHub
3. Replit will auto-detect the project structure
4. Set environment variables in Secrets tab
5. Click "Run"

## Verification Checklist

Before submitting:
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Can record audio
- [ ] Transcription works
- [ ] Suggestions generate every 30s
- [ ] Manual refresh works
- [ ] Chat works
- [ ] Export downloads JSON
- [ ] README updated with URLs
- [ ] Tested with actual Groq API key

## Estimated Time

- Backend deployment: 10 minutes
- Frontend deployment: 5 minutes
- CORS update: 3 minutes
- Testing: 10 minutes
- **Total: ~30 minutes**

## Support

If you encounter issues:
- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/docs
- Groq API Docs: https://console.groq.com/docs

Good luck with your interview! 🎉
