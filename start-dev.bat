@echo off
echo ========================================
echo AI Analyst - Starting Development Servers
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
