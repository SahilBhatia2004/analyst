# AI Analyst SaaS - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### Automated Setup (Windows)

1. **Setup Frontend:**
   ```bash
   setup-frontend.bat
   ```

2. **Setup Backend:**
   ```bash
   setup-backend.bat
   ```

3. **Start Both Servers:**
   ```bash
   start-dev.bat
   ```

### Manual Setup

#### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```
   REACT_APP_SUPABASE_URL=https://jcownkmketiwvaofbiae.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb3dua21rZXRpd3Zhb2ZiaWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQyNDcsImV4cCI6MjA3NzIyMDI0N30.qElcBOCfzJHwVG5eSreOuTDkUeNKYMiA7KYB2tBAQp0
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. Start development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

#### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create `.env` file (copy from `.env.example`):
   ```
   SUPABASE_URL=https://jcownkmketiwvaofbiae.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb3dua21rZXRpd3Zhb2ZiaWFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY0NDI0NywiZXhwIjoyMDc3MjIwMjQ3fQ._qS3NbRbNHG7wQMJPE9duiRA3heRXAU6qeeJ5ZlmodU
   GROK_API_KEY=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
   GROK_API_URL=https://api.groq.com/openai/v1/chat/completions
   LLAMA_MODEL=llama-3.3-70b-versatile
   DEBUG=True
   SECRET_KEY=django-insecure-change-this-in-production
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Start development server:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

## 📋 Features Implemented

### ✅ Authentication
- User signup/login with Supabase
- Secure session management
- User profile display

### ✅ Dashboard Interface
- Split-screen layout (chatbot left, visualizations right)
- Modern, responsive UI inspired by getfluently.app
- Dark theme with customizable color schemes

### ✅ Chatbot
- ChatGPT-like interface
- Numbered query format support
- Real-time message updates
- Loading states and error handling

### ✅ Data Upload
- Support for CSV, Excel (XLSX, XLS) files
- Upload to Supabase storage
- Progress tracking
- File management

### ✅ AI Analysis
- Natural language to SQL conversion using Llama 3.3 via Grok
- Automatic query execution
- AI-generated insights
- Support for multiple queries in one request

### ✅ Visualizations
- Bar charts
- Pie charts
- Line charts
- Scatter plots
- Data tables
- Plotly-powered interactive charts
- Fixed dark grey chart backgrounds
- White text for readability

### ✅ Color Customization
- 10 pre-defined color themes
- Real-time theme switching
- Consistent chart styling across themes
- Color grid interface

### ✅ Dashboard Management
- Save dashboards to Supabase
- Presentation mode (full-screen)
- Scrollable content area
- Responsive grid layout

## 🎯 Usage Guide

### 1. Sign Up / Login
- Open `http://localhost:3000`
- Create an account or login with existing credentials

### 2. Upload Data
- Click "Upload Data" button
- Select CSV or Excel files
- Files are stored in Supabase storage bucket "files"

### 3. Ask Questions
Format your queries in numbered format:
```
1. Show total sales by month (bar chart)
2. Display revenue distribution by category (pie chart)
3. List top 10 products by revenue (table)
```

### 4. View Results
- Charts appear on the right side
- Each chart includes:
  - Title
  - Visualization
  - AI-generated insights
  - SQL query used

### 5. Customize Colors
- Click "Colors" button
- Select from 10 pre-defined themes
- Changes apply immediately

### 6. Save & Present
- Click "Save" to store dashboard in Supabase
- Click "Present" for full-screen presentation mode
- Press "Exit Presentation" to return to normal view

## 🔧 API Endpoints

### Backend API

#### Health Check
```
GET /api/health/
```

#### Analyze Query
```
POST /api/analyze/
Content-Type: application/json

{
  "query": "Show total sales by month",
  "chart_type": "bar chart",
  "files": ["user_id/filename.csv"]
}
```

Response:
```json
{
  "sql_query": "SELECT month, SUM(sales) FROM data GROUP BY month",
  "chart_data": {
    "traces": [...],
    "layout": {...}
  },
  "insights": "Key findings from the analysis...",
  "row_count": 12
}
```

## 📊 Supported Chart Types

- **Bar Chart**: `bar chart`, `bar`, `column chart`
- **Pie Chart**: `pie chart`, `pie`
- **Line Chart**: `line chart`, `line`
- **Scatter Plot**: `scatter chart`, `scatter`
- **Table**: `table`, `data table`

## 🎨 Color Themes

1. Dark Green (Default)
2. Dark Blue
3. Dark Purple
4. Dark Red
5. Dark Cyan
6. Dark Orange
7. Dark Pink
8. Dark Teal
9. Midnight
10. Charcoal

## 🔐 Security Notes

- Never commit `.env` files to version control
- Keep your Supabase keys secure
- Keep your Grok API key secure
- Use environment variables for all sensitive data
- In production, set `DEBUG=False` and use a strong `SECRET_KEY`

## 🐛 Troubleshooting

### Frontend won't start
- Ensure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

### Backend won't start
- Ensure Python is installed: `python --version`
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Check if port 8000 is available

### CORS errors
- Ensure backend is running on port 8000
- Check `CORS_ALLOWED_ORIGINS` in backend `.env`
- Verify `REACT_APP_BACKEND_URL` in frontend `.env`

### File upload fails
- Check Supabase storage bucket "files" exists
- Verify Supabase credentials
- Check file size limits

### SQL generation fails
- Verify Grok API key is correct
- Check API rate limits
- Ensure data schema is clear

## 📝 Development Notes

### Project Structure
```
ai analyst/
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/      # Login/Signup
│   │   │   └── Dashboard/ # Main dashboard
│   │   ├── config/        # Supabase config
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/               # Django application
│   ├── ai_analyst/       # Django project
│   ├── analyzer/         # Main app
│   │   ├── services/     # Business logic
│   │   │   ├── grok_service.py
│   │   │   ├── data_processor.py
│   │   │   └── chart_generator.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

### Tech Stack
- **Frontend**: React, TailwindCSS, Supabase Client, Plotly.js, Axios
- **Backend**: Django, DRF, Supabase Python, Pandas, Plotly
- **AI**: Llama 3.3 via Grok API
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

## 🚀 Next Steps

1. Test the application with sample data
2. Customize the UI to match your brand
3. Add more chart types as needed
4. Implement user dashboard history
5. Add export functionality (PDF, PNG)
6. Implement sharing features
7. Add collaborative features
8. Deploy to production

## 📞 Support

For issues or questions:
1. Check this guide
2. Review error messages in browser console
3. Check backend logs
4. Verify environment variables

## 📄 License

MIT License - Feel free to use and modify for your needs.
