@echo off
echo ========================================
echo AI Analyst - Backend Setup
echo ========================================
echo.

cd backend

echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please update with your credentials.
) else (
    echo .env file already exists.
)

echo.
echo Running migrations...
python manage.py migrate

echo.
echo ========================================
echo Backend setup complete!
echo ========================================
echo.
echo To start the development server, run:
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
pause
