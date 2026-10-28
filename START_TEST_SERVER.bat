@echo off
setlocal
cd /d "%~dp0"
echo Starting Ashri Ventures V10 local test server...
where py >nul 2>nul
if %errorlevel%==0 (
  start "Ashri Ventures Test Server" /min cmd /c "py -m http.server 8080"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "Ashri Ventures Test Server" /min cmd /c "python -m http.server 8080"
  ) else (
    echo Python was not found. Please install Python or open this folder with VS Code Live Server.
    pause
    exit /b 1
  )
)
timeout /t 2 >nul
echo.
echo Website: http://127.0.0.1:8080/index.html
echo Registration: http://127.0.0.1:8080/register.html
echo Member Login Demo: http://127.0.0.1:8080/login.html
echo Admin Control Center: http://127.0.0.1:8080/admin-preview/index.html
echo Admin Setup: http://127.0.0.1:8080/admin-preview/settings.html
echo.
echo To stop the server, close the server window opened in the background.
start "" http://127.0.0.1:8080/index.html
pause
