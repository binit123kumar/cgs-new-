@echo off
REM ============================================================
REM CGS CMS - Start All (Backend + Website [includes Admin at /admin])
REM Project folder: D:\v\cgs
REM ============================================================

echo Starting Backend (ASP.NET Core API)...
start "1 - BACKEND (localhost:7050)" cmd /k "cd /d D:\v\cgs\Backend\backend\CGS.CMS.API && dotnet run"

timeout /t 5 /nobreak >nul

echo Starting Website (React - includes Admin Panel at /admin)...
start "2 - WEBSITE + ADMIN (localhost:3000)" cmd /k "cd /d D:\v\cgs\Website && npm start"

echo.
echo ============================================================
echo  Do services alag-alag windows mein start ho rahi hain:
echo    1. Backend            -^> https://localhost:7050/swagger
echo    2. Website             -^> http://localhost:3000
echo    3. Admin Panel (andar) -^> http://localhost:3000/admin
echo  Sabko band karne ke liye har window ko close kar dena.
echo ============================================================
echo.
pause
