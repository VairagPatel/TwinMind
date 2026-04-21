# ⚡ Quick Deploy Guide

Ultra-fast deployment checklist. For detailed instructions, see `NETLIFY_RENDER_DEPLOYMENT.md`.

## 🎯 Prerequisites (2 minutes)
- [ ] Code pushed to GitHub
- [ ] Groq API key ready: https://console.groq.com

## 🔧 Backend on Render (10 minutes)

1. **Create Service**: https://render.com → New + → Web Service
2. **Configure**:
   - Root Directory: `backend`
   - Build: `mvn clean install -DskipTests`
   - Start: `java -jar target/twinmind-0.0.1-SNAPSHOT.jar`
   - Env: `JAVA_VERSION=17`
3. **Deploy** → Copy URL (e.g., `https://twinmind-backend.onrender.com`)
4. **Test**: Visit `https://your-url.onrender.com/api/health`

## 🎨 Frontend on Netlify (5 minutes)

1. **Create Site**: https://netlify.com → Add new site → Import from GitHub
2. **Configure**:
   - Base directory: `frontend`
   - Build: `npm run build`
   - Publish: `frontend/dist`
   - Env: `VITE_API_BASE_URL=https://your-backend-url.onrender.com`
3. **Deploy** → Copy URL (e.g., `https://twinmind.netlify.app`)

## 🔗 Connect Them (3 minutes)

1. **Update CORS**: Render → Environment → `ALLOWED_ORIGIN=https://your-netlify-url.netlify.app`
2. **Wait for redeploy** (2 minutes)

## ✅ Test (2 minutes)

1. Open Netlify URL
2. Settings → Add Groq API key
3. Start Recording → Speak 30s → Verify transcript + suggestions

## 🎉 Done!

Total time: ~20 minutes

---

## 🆘 Quick Fixes

**CORS Error?**
→ Check `ALLOWED_ORIGIN` matches Netlify URL exactly (no trailing slash)

**Build Failed?**
→ Check deploy logs, verify environment variables

**Blank Page?**
→ Open DevTools (F12), check Console for errors

**No Transcription?**
→ Verify Groq API key, check browser console

---

## 📝 Update README

```markdown
## 🚀 Live Demo
- Frontend: https://your-site.netlify.app
- Backend: https://your-backend.onrender.com
```

---

For detailed troubleshooting, see `NETLIFY_RENDER_DEPLOYMENT.md`
