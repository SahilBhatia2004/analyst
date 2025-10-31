@echo off
echo ========================================
echo AI Analyst - Frontend Setup
echo ========================================
echo.

cd frontend

echo Installing dependencies...
call npm install

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please update with your credentials.
) else (
    echo .env file already exists.
)

echo.
echo ========================================
echo Frontend setup complete!
echo ========================================
echo.
echo To start the development server, run:
echo   cd frontend
echo   npm start
echo.
pause
