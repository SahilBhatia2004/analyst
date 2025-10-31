# AI Analyst SaaS

An intelligent data analysis platform that converts natural language queries into SQL, generates visualizations, and creates professional dashboards.

## Features

- 🔐 Supabase Authentication (Login/Signup)
- 💬 Interactive ChatGPT-like Interface
- 📊 Dynamic Dashboard Generation
- 🎨 Customizable Color Themes
- 📈 Plotly Chart Visualizations
- 📁 Excel/CSV/Google Sheets Upload
- 💾 Save & Share Dashboards
- 🎯 Presentation Mode
- 🤖 AI-Powered SQL Generation (Llama via Grok)

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Supabase Client
- Plotly.js
- Lucide Icons

### Backend
- Django
- Django REST Framework
- Supabase Python Client
- Pandas
- Plotly

## Setup Instructions

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with Supabase credentials:
```
REACT_APP_SUPABASE_URL=https://jcownkmketiwvaofbiae.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb3dua21rZXRpd3Zhb2ZiaWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQyNDcsImV4cCI6MjA3NzIyMDI0N30.qElcBOCfzJHwVG5eSreOuTDkUeNKYMiA7KYB2tBAQp0
```

4. Start development server:
```bash
npm start
```

### Backend Setup

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

5. Create `.env` file:
```
SUPABASE_URL=https://jcownkmketiwvaofbiae.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb3dua21rZXRpd3Zhb2ZiaWFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY0NDI0NywiZXhwIjoyMDc3MjIwMjQ3fQ._qS3NbRbNHG7wQMJPE9duiRA3heRXAU6qeeJ5ZlmodU
GROK_API_KEY=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
GROK_API_URL=https://api.groq.com/openai/v1/chat/completions
LLAMA_MODEL=llama-3.3-70b-versatile
```

6. Run migrations:
```bash
python manage.py migrate
```

7. Start development server:
```bash
python manage.py runserver
```

## Usage

1. Sign up or log in using Supabase authentication
2. Upload your data files (Excel, CSV, or Google Sheets)
3. Enter your queries in numbered format in the chatbot
4. Specify the chart type you want for each query
5. AI generates SQL, processes data, and creates visualizations
6. Customize dashboard colors using the color grid
7. Save your dashboard or present it in full-screen mode

## License

MIT
