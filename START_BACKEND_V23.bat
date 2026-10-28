@echo off
setlocal
cd /d "%~dp0"
echo Ashri Ventures V23 secure backend
echo This requires .env and a dedicated PostgreSQL test database.
if not exist ".env" (
  echo ERROR: .env not found. Copy .env.example to .env and configure DATABASE_URL and SESSION_SECRET.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :failed
)
echo Starting backend on configured PORT (default 5000)...
call npm start
if errorlevel 1 goto :failed
exit /b 0
:failed
echo Backend did not start. Read the error above and check PostgreSQL/.env.
pause
exit /b 1
