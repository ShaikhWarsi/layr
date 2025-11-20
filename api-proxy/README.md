# Layr API Proxy

This is a secure serverless API proxy that keeps your Groq API key safe while allowing the Layr extension to work for all users.

## 🚀 Free Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free) - sign up at https://vercel.com

### Deployment Steps

#### 1. Install Vercel CLI (Optional for local testing)
```bash
npm install -g vercel
```

#### 2. Deploy to Vercel

**Option A: Deploy via GitHub (Recommended)**
1. Push this `api-proxy` folder to your GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Set Root Directory to `api-proxy`
6. Add Environment Variable:
   - Key: `GROQ_API_KEY`
   - Value: `your_groq_api_key_here`
7. Click "Deploy"

**Option B: Deploy via CLI**
```bash
cd api-proxy
vercel
# Follow the prompts
# When asked, enter your GROQ_API_KEY as an environment variable
```

#### 3. Get Your API Endpoint
After deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

Your API endpoint will be:
```
https://your-project-name.vercel.app/api/chat
```

#### 4. Update Extension Code
Copy your Vercel URL and update `src/planner/providers/groq.ts`:
```typescript
private baseURL = 'https://your-project-name.vercel.app/api/chat';
```

## 🧪 Local Testing

1. Create `.env` file:
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

2. Install dependencies:
```bash
npm install
```

3. Run locally:
```bash
npm run dev
```

4. Test the endpoint:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a simple hello world app",
    "model": "llama-3.3-70b-versatile",
    "maxTokens": 8000
  }'
```

## 🔒 Security Features

- ✅ API key stored securely in Vercel environment variables
- ✅ Never exposed in client-side code
- ✅ CORS enabled for your extension
- ✅ Rate limiting (via Vercel's built-in limits)
- ✅ Automatic HTTPS

## 📊 Monitoring

View usage and logs in your [Vercel Dashboard](https://vercel.com/dashboard):
- Real-time function logs
- Request analytics
- Error tracking

## 💰 Pricing

Vercel Free Tier includes:
- ✅ 100 GB bandwidth/month
- ✅ 100,000 function invocations/month
- ✅ Unlimited projects
- ✅ Automatic SSL

**This is more than enough for a VS Code extension!**

## 🔄 Updates

To update your deployed proxy:
1. Make changes to the code
2. Commit and push to GitHub
3. Vercel automatically redeploys

Or via CLI:
```bash
vercel --prod
```

## 📝 API Endpoint Usage

### Request Format
```json
POST https://your-app.vercel.app/api/chat
Content-Type: application/json

{
  "prompt": {
    "systemPrompt": "You are an AI assistant...",
    "userPrompt": "Create a React app"
  },
  "model": "llama-3.3-70b-versatile",
  "maxTokens": 8000
}
```

### Response Format
```json
{
  "success": true,
  "content": "Generated plan content...",
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 500,
    "total_tokens": 600
  }
}
```

## 🐛 Troubleshooting

### "API configuration error"
- Make sure `GROQ_API_KEY` is set in Vercel environment variables
- Redeploy after adding environment variables

### CORS errors
- Check that `vercel.json` has correct CORS headers
- Verify the request is coming from your extension

### Rate limiting
- Groq free tier: Check your usage at console.groq.com
- Vercel limits: Check your Vercel dashboard

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
