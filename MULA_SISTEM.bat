@echo off
title JOM KENYANG - Foodbank Dapur Siswa MADANI
echo ========================================================
echo   Memulakan Pelayan Web JOM KENYANG...
echo ========================================================
echo.
cd /d "%~dp0"

echo Membuka pelayar web di http://localhost:3000 ...
start http://localhost:3000

echo.
echo Pelayan sedang berjalan. Jangan tutup tetingkap ini semasa menggunakan sistem.
echo.
npm run dev

pause
