# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Backend
- [ ] All tests pass locally: `mvn test`
- [ ] Build succeeds: `mvn clean install`
- [ ] Application starts: `mvn spring-boot:run`
- [ ] Health endpoint works: `curl http://localhost:8080/api/health`
- [ ] All API endpoints tested with Postman/curl
- [ ] CORS configuration reviewed
- [ ] Environment variables documented

### Frontend
- [ ] All TypeScript errors resolved: `npm run build`
- [ ] Development server runs: `npm run dev`
- [ ] Production build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] All components render correctly
- [ ] No console errors in browser
- [ ] Environment variables configured

### Documentation
- [ ] README.md is complete and accurate
- [ ] QUICKSTART.md tested by someone else
- [ ] DEPLOYMENT.md has correct URLs
- [ ] API endpoints documented
- [ ] Known limitations listed

## Deployment Steps

### 1. Backend Deployment (Render)

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Configure service:
  - [ ] Name: `twinmind-backend`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `mvn clean install`
  - [ ] Start Command: `java -jar target/twinmind-0.0.1-SNAPSHOT.jar`
- [ ] Set environment variables:
  - [ ] `ALLOWED_ORIGIN`: (will set after frontend deployment)
- [ ] Deploy and wait for success
- [ ] Copy backend URL (e.g., `https://twinmind-backend.onrender.com`)
- [ ] Test health endpoint: `curl https://your-backend-url/api/health`

### 2. Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Create new project
- [ ] Configure project:
  - [ ] Framework: Vite
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Set environment variables:
  - [ ] `VITE_API_BASE_URL`: (paste backend URL from step 1)
- [ ] Deploy and wait for success
- [ ] Copy frontend URL (e.g., `https://twinmind.vercel.app`)

### 3. Update CORS

- [ ] Go back to Render backend settings
- [ ] Update `ALLOWED_ORIGIN` environment variable with frontend URL
- [ ] Redeploy backend
- [ ] Wait for deployment to complete

### 4. Verification

- [ ] Visit frontend URL
- [ ] Open browser DevTools (F12)
- [ ] Check for console errors
- [ ] Open Settings modal
- [ ] Add Groq API key
- [ ] Click "Start Recording"
- [ ] Allow microphone access
- [ ] Speak for 30 seconds
- [ ] Verify transcript appears
- [ ] Wait for suggestions (60 seconds total)
- [ ] Verify suggestions appear
- [ ] Click a suggestion
- [ ] Verify chat response appears
- [ ] Type a manual message
- [ ] Verify chat works
- [ ] Export session
- [ ] Verify JSON downloads
- [ ] Test on different browsers (Chrome, Firefox, Safari)

## Post-Deployment

### Monitoring

- [ ] Set up Render monitoring/alerts
- [ ] Set up Vercel monitoring/alerts
- [ ] Monitor Groq API usage in console
- [ ] Check backend logs for errors
- [ ] Check frontend analytics (if configured)

### Documentation Updates

- [ ] Update README.md with live URLs
- [ ] Update DEPLOYMENT.md with actual deployment steps taken
- [ ] Document any issues encountered and solutions
- [ ] Add screenshots to README

### Performance Testing

- [ ] Test with 5-minute conversation
- [ ] Test with 30-minute conversation
- [ ] Test multiple concurrent users (if possible)
- [ ] Check API response times
- [ ] Monitor memory usage
- [ ] Check for memory leaks

### Security Review

- [ ] Verify HTTPS is enforced
- [ ] Check CORS is properly restricted
- [ ] Verify API keys are not exposed in frontend code
- [ ] Check for XSS vulnerabilities
- [ ] Review error messages (no sensitive data exposed)
- [ ] Test with invalid inputs

## Rollback Plan

If deployment fails:

### Backend Rollback
1. Go to Render dashboard
2. Find previous successful deployment
3. Click "Redeploy"
4. Wait for completion

### Frontend Rollback
1. Go to Vercel dashboard
2. Find previous successful deployment
3. Click "Promote to Production"
4. Wait for completion

## Common Issues

### Backend won't start
- Check Java version (need 17+)
- Check Maven build logs
- Verify all dependencies downloaded
- Check application.properties syntax

### Frontend build fails
- Check Node version (need 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors
- Verify all imports are correct

### CORS errors
- Verify `ALLOWED_ORIGIN` matches frontend URL exactly
- Check for trailing slashes
- Ensure backend redeployed after changing env var

### Transcription fails
- Verify Groq API key is valid
- Check API key has credits
- Check backend logs for error details
- Test with curl to isolate issue

### Suggestions not generating
- Ensure transcript has at least 50 characters
- Check backend logs for JSON parsing errors
- Verify prompt returns valid JSON
- Test prompt in Groq playground

## Success Criteria

- [ ] Frontend loads without errors
- [ ] Backend health check returns 200
- [ ] Recording starts successfully
- [ ] Transcription appears within 30 seconds
- [ ] Suggestions generate within 60 seconds
- [ ] Chat responds within 5 seconds
- [ ] Export downloads valid JSON
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile view is acceptable (even if not optimized)

## Next Steps After Deployment

1. Share with stakeholders
2. Gather feedback
3. Monitor usage and errors
4. Plan next iteration
5. Update documentation based on feedback
6. Consider adding analytics
7. Plan for scaling if needed

## Emergency Contacts

- Render Support: https://render.com/support
- Vercel Support: https://vercel.com/support
- Groq Support: https://console.groq.com/support

## Notes

Use this space to document any deployment-specific notes:

- Deployment date: _______________
- Backend URL: _______________
- Frontend URL: _______________
- Issues encountered: _______________
- Solutions applied: _______________
- Performance notes: _______________
