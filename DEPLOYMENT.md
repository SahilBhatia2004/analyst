# 🚀 Deployment Guide - AI Analyst SaaS

## Production Deployment Checklist

### Pre-Deployment

- [ ] All features tested locally
- [ ] No console errors
- [ ] Environment variables documented
- [ ] Security review completed
- [ ] Performance optimization done

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel (Recommended for React)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_BACKEND_URL` (your production backend URL)

5. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod --dir=build
   ```

5. **Set Environment Variables in Netlify Dashboard:**
   - Same as Vercel

## Backend Deployment

### Option 1: Railway

1. **Create account at railway.app**

2. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login:**
   ```bash
   railway login
   ```

4. **Navigate to backend:**
   ```bash
   cd backend
   ```

5. **Initialize:**
   ```bash
   railway init
   ```

6. **Add environment variables:**
   ```bash
   railway variables set SUPABASE_URL=your_url
   railway variables set SUPABASE_KEY=your_key
   railway variables set GROK_API_KEY=your_key
   railway variables set GROK_API_URL=https://api.groq.com/openai/v1/chat/completions
   railway variables set LLAMA_MODEL=llama-3.3-70b-versatile
   railway variables set DEBUG=False
   railway variables set SECRET_KEY=your_production_secret_key
   railway variables set ALLOWED_HOSTS=your-app.railway.app
   railway variables set CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

7. **Deploy:**
   ```bash
   railway up
   ```

### Option 2: Heroku

1. **Create Heroku account**

2. **Install Heroku CLI**

3. **Create Procfile in backend directory:**
   ```
   web: gunicorn ai_analyst.wsgi --log-file -
   ```

4. **Add gunicorn to requirements.txt:**
   ```bash
   echo "gunicorn==21.2.0" >> requirements.txt
   ```

5. **Create runtime.txt:**
   ```
   python-3.11.0
   ```

6. **Deploy:**
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set SUPABASE_URL=your_url
   heroku config:set SUPABASE_KEY=your_key
   heroku config:set GROK_API_KEY=your_key
   # ... set all other env vars
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Configure build settings**
3. **Set environment variables**
4. **Deploy**

## Database (Production)

Since we're using Supabase, no additional database setup needed. Supabase handles:
- PostgreSQL database
- File storage
- Authentication
- Real-time subscriptions

## Environment Variables Summary

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=https://jcownkmketiwvaofbiae.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

### Backend (.env)
```
SUPABASE_URL=https://jcownkmketiwvaofbiae.supabase.co
SUPABASE_KEY=your_service_role_key
GROK_API_KEY=your_grok_key
GROK_API_URL=https://api.groq.com/openai/v1/chat/completions
LLAMA_MODEL=llama-3.3-70b-versatile
DEBUG=False
SECRET_KEY=your_strong_secret_key_here
ALLOWED_HOSTS=your-backend.railway.app,your-backend.herokuapp.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

## Security Best Practices

### 1. Secret Key
Generate a strong secret key:
```python
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 2. HTTPS Only
- Ensure both frontend and backend use HTTPS
- Most platforms (Vercel, Railway, Heroku) provide this automatically

### 3. CORS Configuration
- Only allow your frontend domain
- Don't use wildcards in production

### 4. API Keys
- Never commit API keys to git
- Use environment variables
- Rotate keys regularly

### 5. Supabase Security
- Use Row Level Security (RLS) policies
- Limit storage bucket permissions
- Use service role key only on backend

## Performance Optimization

### Frontend
1. **Code Splitting:**
   - React.lazy() for route-based splitting
   - Already configured in create-react-app

2. **Asset Optimization:**
   - Images: Use WebP format
   - Icons: Already using Lucide (tree-shakeable)

3. **Caching:**
   - Configure cache headers
   - Use CDN for static assets

### Backend
1. **Database Optimization:**
   - Add indexes for frequently queried columns
   - Use connection pooling

2. **API Optimization:**
   - Implement rate limiting
   - Cache frequent queries
   - Use pagination for large datasets

3. **File Processing:**
   - Process large files asynchronously
   - Implement file size limits

## Monitoring

### Frontend
- **Vercel Analytics**: Built-in
- **Google Analytics**: Add tracking code
- **Sentry**: For error tracking

### Backend
- **Railway Logs**: Built-in
- **Sentry**: For error tracking
- **New Relic**: For performance monitoring

## Scaling Considerations

### When to Scale

**Frontend:**
- Handled automatically by Vercel/Netlify CDN

**Backend:**
- Monitor response times
- Watch memory usage
- Track API rate limits

### Scaling Options

1. **Vertical Scaling:**
   - Upgrade Railway/Heroku plan
   - Increase memory/CPU

2. **Horizontal Scaling:**
   - Add more backend instances
   - Use load balancer

3. **Database Scaling:**
   - Supabase handles this automatically
   - Upgrade Supabase plan if needed

## Cost Estimation

### Free Tier (Development/Testing)
- **Vercel**: Free for personal projects
- **Railway**: $5/month credit
- **Supabase**: Free tier (500MB database, 1GB storage)
- **Grok API**: Pay per use

### Production (Small Scale)
- **Vercel Pro**: $20/month
- **Railway**: ~$10-20/month
- **Supabase Pro**: $25/month
- **Grok API**: ~$50-100/month (depends on usage)
- **Total**: ~$105-165/month

## Backup Strategy

### Supabase
- Automatic daily backups (Pro plan)
- Manual backups via dashboard
- Export data regularly

### Code
- GitHub repository (private)
- Tag releases
- Document deployment process

## Rollback Plan

If deployment fails:

1. **Frontend:**
   ```bash
   vercel rollback
   ```

2. **Backend:**
   ```bash
   railway rollback
   ```

3. **Database:**
   - Restore from Supabase backup
   - Revert migrations if needed

## Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Set up alerts
- [ ] Document any issues
- [ ] Update DNS if using custom domain
- [ ] Enable SSL certificate
- [ ] Configure CDN
- [ ] Set up monitoring dashboards

## Custom Domain Setup

### Frontend (Vercel)
1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records

### Backend (Railway)
1. Go to Railway dashboard
2. Settings → Domains
3. Add custom domain
4. Update DNS records

## CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          cd backend
          railway up
```

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Monitor API usage
- [ ] Check storage usage
- [ ] Review security alerts
- [ ] Backup database
- [ ] Test disaster recovery

---

**Your AI Analyst SaaS is ready for production! 🚀**
