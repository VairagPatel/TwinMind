# 🚀 Deploy TwinMind to Netlify + Render

Complete guide to deploy your TwinMind application with frontend on Netlify and backend on Render.

## Prerequisites

- GitHub account with your code pushed
- Netlify account (free tier works)
- Render account (free tier works)
- Groq API key from https://console.groq.com

## Part 1: Deploy Backend to Render (15 minutes)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended for easy repo access)
3. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click **"New +"** button in top right
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Select your TwinMind repository

### Step 3: Configure Backend Service
Fill in the following settings:

- **Name**: `twinmind-backend` (or your preferred name)
- **Region**: Choose closest to your location
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Java`
- **Build Command**: 
  ```bash
  mvn clean install -DskipTests
  ```
- **Start Command**: 
  ```bash
  java -jar target/twinmind-0.0.1-SNAPSHOT.jar
  ```

### Step 4: Set Environment Variables
Click **"Advanced"** and add:

| Key | Value |
|-----|-------|
| `ALLOWED_ORIGIN` | Leave blank for now (will update after frontend) |
| `JAVA_VERSION` | `17` |

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll see: ✅ **Live**

### Step 6: Copy Backend URL
- Look for your service URL (e.g., `https://twinmind-backend.onrender.com`)
- **SAVE THIS URL** - you'll need it for frontend deployment

### Step 7: Test Backend
Open a new browser tab and visit:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Part 2: Deploy Frontend to Netlify (10 minutes)

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your TwinMind repository
4. Click **"Configure"** if needed to grant access

### Step 3: Configure Build Settings
Fill in the following:

- **Branch to deploy**: `main`
- **Base directory**: `frontend`
- **Build command**: 
  ```bash
  npm run build
  ```
- **Publish directory**: 
  ```bash
  frontend/dist
  ```

### Step 4: Set Environment Variables
Click **"Show advanced"** → **"New variable"**

Add this variable:

| Key | Value |
|-----|-------|VITE_API_BASE_URL
| `` | `https://your-backend-url.onrender.com` |

⚠️ **IMPORTANT**: Replace with YOUR actual Render backend URL from Part 1, Step 6

### Step 5: Deploy Frontend
1. Click **"Deploy site"**
2. Wait 2-3 minutes for build
3. Watch the deploy logs
4. Once deployed, you'll see: ✅ **Published**

### Step 6: Copy Frontend URL
- Netlify assigns a random URL like `https://random-name-123456.netlify.app`
- You can customize this: **Site settings** → **Change site name**
- **SAVE THIS URL** - you need it for CORS configuration

---

## Part 3: Update CORS Configuration (5 minutes)

Now that both are deployed, connect them properly:

### Step 1: Update Backend CORS
1. Go back to **Render dashboard**
2. Open your **twinmind-backend** service
3. Click **"Environment"** in left sidebar
4. Find `ALLOWED_ORIGIN` variable
5. Update value to your Netlify URL:
   ```
   https://your-site-name.netlify.app
   ```
6. Click **"Save Changes"**

### Step 2: Wait for Redeploy
- Render will automatically redeploy (2-3 minutes)
- Watch for ✅ **Live** status

---

## Part 4: Test Your Deployment (5 minutes)

### Step 1: Open Your App
Visit your Netlify URL: `https://your-site-name.netlify.app`

### Step 2: Configure API Key
1. Click the **⚙️ Settings** icon (top right)
2. Paste your Groq API key
3. Click **Save**

### Step 3: Test Recording
1. Click **"Start Recording"**
2. Allow microphone access
3. Speak for 30-45 seconds
4. Stop recording

### Step 4: Verify Features
- ✅ Transcript appears in left panel
- ✅ Suggestions appear in right panel (after ~60 seconds)
- ✅ Click a suggestion → detailed response appears
- ✅ Chat works in bottom panel
- ✅ Export button downloads JSON

---

## 🎉 Success! Your App is Live

Update your README with the live URLs:

```markdown
## 🚀 Live Demo

- **Frontend**: https://your-site-name.netlify.app
- **Backend**: https://twinmind-backend.onrender.com
```

---

## 🔧 Troubleshooting

### Backend Issues

#### Build Fails
**Error**: `Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin`

**Solution**:
1. Check Render logs for specific error
2. Verify Java version is 17 in environment variables
3. Try adding to Build Command:
   ```bash
   mvn clean install -DskipTests -X
   ```

#### Service Won't Start
**Error**: `Application failed to start`

**Solution**:
1. Check Render logs
2. Verify Start Command is correct
3. Check `application.properties` for errors

#### Health Check Fails
**Error**: 404 or timeout on `/api/health`

**Solution**:
1. Verify backend is running (check Render dashboard)
2. Check URL is correct (no trailing slash)
3. Wait 30 seconds for cold start (free tier)

### Frontend Issues

#### Build Fails
**Error**: `npm ERR! code ELIFECYCLE`

**Solution**:
1. Check Netlify deploy logs
2. Verify `VITE_API_BASE_URL` is set
3. Check for TypeScript errors in code
4. Try clearing cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy**

#### Blank Page
**Error**: White screen, no content

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify `dist` folder was created
4. Check Network tab for failed requests

#### CORS Errors
**Error**: `Access to fetch at 'https://...' has been blocked by CORS policy`

**Solution**:
1. Verify `ALLOWED_ORIGIN` on Render matches Netlify URL EXACTLY
2. No trailing slash in either URL
3. Check both are using HTTPS
4. Wait for Render to redeploy after changing env var

### API Issues

#### Transcription Fails
**Error**: `Failed to transcribe audio`

**Solution**:
1. Verify Groq API key is valid
2. Check key has credits: https://console.groq.com
3. Test key with curl:
   ```bash
   curl https://api.groq.com/openai/v1/models \
     -H "Authorization: Bearer YOUR_KEY"
   ```
4. Check audio file size (must be < 25MB)

#### Suggestions Not Generating
**Error**: No suggestions appear after 60 seconds

**Solution**:
1. Check browser console for errors
2. Verify transcript has at least 50 characters
3. Check backend logs on Render
4. Try manual refresh button

#### Chat Not Working
**Error**: Chat doesn't respond

**Solution**:
1. Check browser console
2. Verify API key is set
3. Check backend logs
4. Try refreshing the page

---

## 💰 Cost Breakdown

### Free Tier Limits

**Render Free Tier**:
- 750 hours/month (enough for 1 service)
- Spins down after 15 minutes of inactivity
- Cold start: ~30 seconds
- ✅ Perfect for demo/portfolio

**Netlify Free Tier**:
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- ✅ More than enough for this project

**Groq API**:
- Pay-per-use
- Very affordable (~$0.10 per hour of audio)
- Free tier available for testing

### Upgrade Costs (if needed)

- **Render**: $7/month (no cold starts, always on)
- **Netlify**: $19/month (more bandwidth, faster builds)
- **Groq**: Pay as you go (check current pricing)

---

## 🔒 Security Checklist

Before sharing your app:

- [ ] CORS is restricted to your Netlify domain only
- [ ] API key is stored in localStorage (not in code)
- [ ] No sensitive data in GitHub repo
- [ ] HTTPS is enforced (automatic on both platforms)
- [ ] Environment variables are not exposed in frontend
- [ ] Backend logs don't expose API keys

---

## 📊 Monitoring

### Render Monitoring
1. Go to Render dashboard
2. Click your service
3. View **Metrics** tab for:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Netlify Monitoring
1. Go to Netlify dashboard
2. Click your site
3. View **Analytics** for:
   - Page views
   - Bandwidth usage
   - Build times

### Groq Monitoring
1. Go to https://console.groq.com
2. View **Usage** for:
   - API calls
   - Token usage
   - Costs

---

## 🚀 Next Steps

### Custom Domain (Optional)
1. Buy domain from Namecheap, Google Domains, etc.
2. In Netlify: **Domain settings** → **Add custom domain**
3. Update DNS records as instructed
4. Update `ALLOWED_ORIGIN` on Render to new domain

### Performance Optimization
1. Enable Netlify CDN (automatic)
2. Add caching headers
3. Optimize bundle size
4. Consider upgrading Render to paid tier (no cold starts)

### Feature Additions
1. Add user authentication
2. Store sessions in database
3. Add meeting summaries
4. Implement WebSocket for real-time updates

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Groq Docs**: https://console.groq.com/docs
- **Vite Docs**: https://vitejs.dev
- **Spring Boot Docs**: https://spring.io/projects/spring-boot

---

## ✅ Deployment Checklist

Use this to track your progress:

### Backend (Render)
- [ ] Account created
- [ ] Repository connected
- [ ] Service configured
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] Health check passes
- [ ] URL saved

### Frontend (Netlify)
- [ ] Account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] Site loads correctly
- [ ] URL saved

### Integration
- [ ] CORS configured
- [ ] Backend redeployed
- [ ] Frontend can reach backend
- [ ] No CORS errors

### Testing
- [ ] Recording works
- [ ] Transcription appears
- [ ] Suggestions generate
- [ ] Chat responds
- [ ] Export downloads

### Documentation
- [ ] README updated with URLs
- [ ] Deployment notes documented
- [ ] Known issues listed

---

## 🎓 Learning Resources

If you want to understand the deployment better:

- **CI/CD Basics**: https://www.netlify.com/blog/2021/03/08/what-is-ci-cd/
- **Docker vs PaaS**: https://render.com/docs/docker
- **Environment Variables**: https://12factor.net/config
- **CORS Explained**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

Good luck with your deployment! 🚀
