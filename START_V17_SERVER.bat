@echo off
cd /d "%~dp0"
if not exist .env (
  echo Missing .env. Copy .env.example to .env and configure database/secrets first.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto fail
)
echo Starting Ashri Ventures V17 backend...
call npm start
if errorlevel 1 goto fail
exit /b 0
:fail
echo Server start failed. Check PostgreSQL, .env, and the error above.
pause
