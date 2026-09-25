@echo off
echo Installing requirements...
pip install -r requirements.txt
echo.
echo Starting FastAPI Backend...
python main.py
pause
