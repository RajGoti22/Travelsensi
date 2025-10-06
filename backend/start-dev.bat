@echo off
echo Starting TravelSensei Backend Server...
echo.

echo Checking dependencies...
cd /d %~dp0
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting development server...
npm run dev

pause