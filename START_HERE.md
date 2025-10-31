# 🎯 START HERE - AI Analyst SaaS

## Welcome! 👋

Your AI Analyst SaaS application is **100% complete** and ready to use!

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup Frontend
Open PowerShell/Command Prompt and run:
```bash
cd "c:\Users\deepa\OneDrive\Desktop\ai analyst"
.\setup-frontend.bat
```
Wait for installation to complete (~2-3 minutes)

### Step 2: Setup Backend
In a new terminal:
```bash
cd "c:\Users\deepa\OneDrive\Desktop\ai analyst"
.\setup-backend.bat
```
Wait for installation to complete (~2-3 minutes)

### Step 3: Start Application
```bash
.\start-dev.bat
```

This will open two terminal windows:
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000

Your browser will automatically open to http://localhost:3000

## 📋 What's Included

✅ **Complete React Frontend** with modern UI
✅ **Complete Django Backend** with AI integration
✅ **Supabase Authentication** (already configured)
✅ **Grok API Integration** (Llama 3.3 - already configured)
✅ **File Upload System** (CSV/Excel support)
✅ **AI-Powered Analysis** (Natural language to SQL)
✅ **Interactive Charts** (Bar, Pie, Line, Table)
✅ **10 Color Themes** (Customizable dashboard)
✅ **Presentation Mode** (Full-screen dashboards)
✅ **Save Dashboards** (To Supabase storage)
✅ **Sample Data** (sample_data.csv for testing)

## 📚 Documentation

1. **QUICKSTART.md** - 5-minute setup guide (you're here!)
2. **SETUP_GUIDE.md** - Detailed installation instructions
3. **TESTING_GUIDE.md** - How to test all features
4. **DEPLOYMENT.md** - Deploy to production
5. **PROJECT_SUMMARY.md** - Complete project overview

## 🎯 First Steps After Setup

### 1. Create Account
- Open http://localhost:3000
- Click "Sign up"
- Enter your details
- You'll be redirected to the dashboard

### 2. Upload Sample Data
- Click "Upload Data" button
- Select the included `sample_data.csv` file
- Wait for upload to complete

### 3. Ask Your First Question
Type in the chatbot:
```
1. Show total revenue by category (bar chart)
```

Press Enter and watch the magic happen! 🎉

### 4. Try More Queries
```
1. Show total revenue by month (bar chart)
2. Display sales distribution by product (pie chart)
3. List top 5 products by revenue (table)
```

### 5. Customize Your Dashboard
- Click "Colors" to change theme
- Click "Present" for full-screen mode
- Click "Save" to store your dashboard

## 🎨 Features Showcase

### Chatbot (Left Side)
- ChatGPT-like interface
- Type numbered queries
- Get AI-generated SQL and insights
- Real-time responses

### Dashboard (Right Side)
- Interactive Plotly charts
- AI-generated insights
- Scrollable layout
- Professional design

### Color Themes
Choose from 10 themes:
- Dark Green (Default)
- Dark Blue
- Dark Purple
- Dark Red
- Dark Cyan
- Dark Orange
- Dark Pink
- Dark Teal
- Midnight
- Charcoal

## 💡 Sample Queries to Try

### Sales Analysis
```
1. Show total revenue by region (bar chart)
2. Display product category distribution (pie chart)
3. Show sales trend over time (line chart)
```

### Top Performers
```
1. List top 10 products by revenue (table)
2. Show top 5 regions by sales (bar chart)
```

### Comparisons
```
1. Compare electronics vs clothing revenue (bar chart)
2. Show revenue by category and region (table)
```

## 🔧 Troubleshooting

### Frontend won't start?
```bash
cd frontend
npm install
npm start
```

### Backend won't start?
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Can't upload files?
- Check that Supabase storage bucket "files" exists
- Verify your Supabase credentials in `.env` files

### Queries not working?
- Ensure backend is running on port 8000
- Check Grok API key is valid
- Verify file was uploaded successfully

## 📊 Your Credentials

### Supabase (Already Configured)
- **URL**: https://jcownkmketiwvaofbiae.supabase.co
- **Anon Key**: Already in `.env.example`
- **Service Key**: Already in `.env.example`

### Grok API (Already Configured)
- **API Key**: Already in `.env.example`
- **Model**: llama-3.3-70b-versatile

### Storage Bucket
- **Name**: files
- **Purpose**: Store uploaded CSV/Excel files and saved dashboards

## 🎓 How It Works

1. **You upload** CSV/Excel file → Stored in Supabase
2. **You ask** question in plain English
3. **AI converts** to SQL using Llama 3.3
4. **System executes** SQL on your data
5. **AI generates** insights about results
6. **You see** beautiful charts and insights

## 🌟 Pro Tips

1. **Format queries with numbers**: Each number = one chart
2. **Specify chart type**: (bar chart), (pie chart), (line chart), (table)
3. **Be specific**: "Show total revenue by month" works better than "show sales"
4. **Multiple queries**: Ask 3-5 questions at once for a complete dashboard
5. **Save your work**: Use the Save button to store dashboards

## 📱 Browser Support

Works best in:
- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

## 🚀 Next Steps

### For Development
1. Customize the UI colors and branding
2. Add your own data
3. Create custom chart types
4. Extend AI capabilities

### For Production
1. Read `DEPLOYMENT.md`
2. Deploy frontend to Vercel
3. Deploy backend to Railway
4. Set up custom domain

## 📞 Need Help?

1. Check the documentation files
2. Review error messages in:
   - Browser console (F12)
   - Backend terminal
3. Verify environment variables
4. Test with sample data first

## ✅ Verification Checklist

Before you start, verify:
- [ ] Node.js installed (`node --version`)
- [ ] Python installed (`python --version`)
- [ ] Internet connection (for API calls)
- [ ] Ports 3000 and 8000 available

## 🎉 You're Ready!

Everything is set up and ready to go. Just run the setup scripts and start analyzing your data with AI!

### Quick Command Reference

```bash
# Setup (one time)
.\setup-frontend.bat
.\setup-backend.bat

# Start application (every time)
.\start-dev.bat

# Or manually:
# Terminal 1:
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2:
cd frontend
npm start
```

---

**Happy Analyzing! 🎊**

Your AI Analyst is ready to transform data into insights!
