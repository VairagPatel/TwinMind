# Deployment Guide

## Backend Deployment (Render/Railway)

### Option 1: Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean install`
   - **Start Command**: `java -jar target/twinmind-0.0.1-SNAPSHOT.jar`
   - **Environment Variables**:
     - `ALLOWED_ORIGIN`: `https://your-frontend-domain.vercel.app`

### Option 2: Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean install -DskipTests`
   - **Start Command**: `java -jar target/twinmind-0.0.1-SNAPSHOT.jar`
   - **Environment Variables**:
     - `ALLOWED_ORIGIN`: `https://your-frontend-domain.vercel.app`
     - `PORT`: `8080` (Railway auto-assigns this)

## Frontend Deployment (Vercel)

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: `https://your-backend-domain.onrender.com` (or Railway URL)

## Post-Deployment Steps

1. Update CORS settings:
   - Go to your backend deployment
   - Set `ALLOWED_ORIGIN` to your Vercel frontend URL
   - Redeploy if necessary

2. Test the deployment:
   - Visit your Vercel URL
   - Open Settings and add your Groq API key
   - Start recording and verify transcription works
   - Check that suggestions are generated
   - Test the chat functionality

## Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGIN` in backend matches your frontend URL exactly
- Check that the frontend is using the correct `VITE_API_BASE_URL`

### Transcription Fails
- Verify Groq API key is valid
- Check backend logs for error messages
- Ensure audio file size is under 25MB

### Suggestions Not Loading
- Check that transcript has enough content (at least 50 characters)
- Verify API key has sufficient credits
- Check browser console for errors

### Build Failures

Backend:
```bash
# Test locally first
cd backend
mvn clean install
java -jar target/twinmind-0.0.1-SNAPSHOT.jar
```

Frontend:
```bash
# Test locally first
cd frontend
npm install
npm run build
npm run preview
```

## Environment Variables Reference

### Backend
- `ALLOWED_ORIGIN`: Frontend URL for CORS (default: `*`)
- `PORT`: Server port (default: `8080`)

### Frontend
- `VITE_API_BASE_URL`: Backend API URL (required)

## Monitoring

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Frontend Health Check
Visit your Vercel URL and check browser console for errors.

## Scaling Considerations

1. **API Rate Limits**: Groq has rate limits. Monitor usage in Groq console.
2. **Audio File Size**: Current limit is 25MB. Adjust in `application.properties` if needed.
3. **Context Windows**: Larger context windows = more tokens = higher costs.
4. **Concurrent Users**: Backend can handle multiple users, but consider database for session persistence.

## Cost Estimates

- **Render/Railway**: Free tier available, paid plans start at $7/month
- **Vercel**: Free tier available, paid plans start at $20/month
- **Groq API**: Pay-per-use, very affordable (check current pricing)

## Security Notes

1. **API Key Storage**: Currently stored in localStorage. For production, implement backend proxy.
2. **CORS**: Restrict `ALLOWED_ORIGIN` to your specific domain.
3. **Rate Limiting**: Consider adding rate limiting to backend endpoints.
4. **HTTPS**: Both Render/Railway and Vercel provide HTTPS by default.
