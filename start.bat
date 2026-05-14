@echo off
title AI Prompt Workbench

echo.
echo   ========================================
echo     AI Drawing Prompt Workbench  v1.0
echo   ========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   [ERROR] Node.js not found
    echo   Please install Node.js 18+ : https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo   Node.js detected:
for /f "tokens=*" %%i in ('node -v') do echo     %%i
echo.

cd /d "%~dp0"

if not exist "node_modules\" (
    echo   Installing dependencies...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo   [ERROR] npm install failed. Check network.
        pause
        exit /b 1
    )
    echo.
    echo   Dependencies installed.
    echo.
)

echo   Starting dev server...
echo   URL: http://localhost:5173
echo   Close this window to stop the server.
echo   ========================================
echo.

start http://localhost:5173

npx vite

pause
