# 🚀 Quick Start Guide - AI Analyst SaaS

## Step 1: Setup Frontend (5 minutes)

Open a terminal and run:

```bash
cd "c:/Users/deepa/OneDrive/Desktop/ai analyst"
setup-frontend.bat
```

**What this does:**
- Installs all React dependencies
- Creates `.env` file with your Supabase credentials

## Step 2: Setup Backend (5 minutes)

Open another terminal and run:

```bash
cd "c:/Users/deepa/OneDrive/Desktop/ai analyst"
setup-backend.bat
```

**What this does:**
- Creates Python virtual environment
- Installs Django and all dependencies
- Creates `.env` file with API keys
- Runs database migrations

## Step 3: Start the Application

### Option A: Automated (Recommended)
```bash
start-dev.bat
```
This opens two terminal windows - one for backend, one for frontend.

### Option B: Manual

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Step 4: Use the Application

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Sign Up**: Create a new account
   - Enter your name, email, and password
   - Click "Create Account"

3. **Upload Data**: 
   - Click "Upload Data" button
   - Select a CSV or Excel file
   - Wait for upload to complete

4. **Ask Questions**: Type in the chatbot (left side):
   ```
   1. Show total sales by month (bar chart)
   2. Display revenue by category (pie chart)
   3. List top 10 products (table)
   ```

5. **View Results**: Charts appear on the right side with AI insights

6. **Customize**: 
   - Click "Colors" to change theme
   - Click "Present" for full-screen mode
   - Click "Save" to store your dashboard

## 🎯 Sample Data Format

Your CSV/Excel should have columns like:

```csv
date,product,category,sales,revenue
2024-01-01,Product A,Electronics,100,5000
2024-01-02,Product B,Clothing,150,3000
```

## ✅ Verification Checklist

- [ ] Frontend running on `http://localhost:3000`
- [ ] Backend running on `http://localhost:8000`
- [ ] Can create an account
- [ ] Can upload a file
- [ ] Can ask questions in chatbot
- [ ] Charts appear on dashboard

## 🐛 Common Issues

**Port already in use:**
- Frontend (3000): Close other React apps
- Backend (8000): Close other Django apps

**Module not found:**
- Frontend: Delete `node_modules`, run `npm install`
- Backend: Activate venv, run `pip install -r requirements.txt`

**Supabase errors:**
- Verify `.env` files have correct credentials
- Check Supabase storage bucket "files" exists

## 📞 Need Help?

Check `SETUP_GUIDE.md` for detailed troubleshooting.

---

**You're all set! Start analyzing your data with AI! 🎉**
