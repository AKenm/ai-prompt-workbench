@echo off
setlocal enabledelayedexpansion
title AI Prompt Workbench

echo.
echo   ========================================
echo     AI Drawing Prompt Workbench  v1.0
echo   ========================================
echo.

:: --- Detect Node.js ---
set NODE_EXE=
set NPM_EXE=

:: 1. Try system PATH
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('where node 2^>nul') do set NODE_EXE=%%i
)

:: 2. Try common install locations
if "%NODE_EXE%"=="" (
    for %%d in (
        "%ProgramFiles%\nodejs"
        "%ProgramFiles(x86)%\nodejs"
        "%LOCALAPPDATA%\Programs\nodejs"
        "%APPDATA%\npm\node.exe"
    ) do (
        if exist "%%~d\node.exe" (
            set NODE_EXE=%%~d\node.exe
            set PATH=%%~d;!PATH!
        )
    )
)

:: 3. Try nvm-windows
if "%NODE_EXE%"=="" (
    if exist "%NVM_HOME%\node.exe" (
        set NODE_EXE=%NVM_HOME%\node.exe
        set PATH=%NVM_HOME%;!PATH!
    )
)

:: 4. Try where again with refreshed PATH
if "%NODE_EXE%"=="" (
    where node >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=*" %%i in ('where node 2^>nul') do set NODE_EXE=%%i
    )
)

:: Still not found - offer to install
if "%NODE_EXE%"=="" (
    echo   Node.js not detected.
    echo.
    echo   [1] Auto-install via winget (Windows 10/11)
    echo   [2] Download from https://nodejs.org (manual)
    echo.
    choice /c 12 /n /m "Choose [1] or [2]: "
    if !errorlevel! equ 1 (
        echo.
        echo   Installing Node.js via winget...
        winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
        if !errorlevel! neq 0 (
            echo   Auto-install failed. Please install manually:
            echo   https://nodejs.org/
            pause
            exit /b 1
        )
        echo   Node.js installed. Restarting...
        echo.
        :: Refresh PATH
        for %%d in ("%ProgramFiles%\nodejs" "%ProgramFiles(x86)%\nodejs") do (
            if exist "%%~d\node.exe" set PATH=%%~d;!PATH!
        )
    ) else (
        start https://nodejs.org
        pause
        exit /b 1
    )
)

:: Verify node works
"%NODE_EXE%" -v >nul 2>&1
if !errorlevel! neq 0 if not "%NODE_EXE%"=="" (
    node -v >nul 2>&1
)

echo   Node.js: 
for /f "tokens=*" %%i in ('node -v 2^>nul') do echo     %%i
echo.

:: --- Enter project directory ---
cd /d "%~dp0"

:: --- Auto install dependencies ---
if not exist "node_modules\" (
    echo   Installing dependencies (first time)...
    echo.
    call npm install
    if !errorlevel! neq 0 (
        echo.
        echo   [ERROR] npm install failed.
        echo   Check network or run: npm install
        pause
        exit /b 1
    )
    echo.
    echo   Dependencies installed.
    echo.
)

:: --- Start ---
echo   Starting dev server...
echo   URL: http://localhost:5173
echo   Close this window to stop the server.
echo   ========================================
echo.

start http://localhost:5173

npx vite

pause
