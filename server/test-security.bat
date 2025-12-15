@echo off
REM Security Features Test Script for CTF Platform
REM Run this after starting the server with: .\mvnw.cmd spring-boot:run

echo ==========================================
echo    CTF Platform Security Tests
echo ==========================================
echo.

REM Note: Using -k to ignore self-signed certificate warnings
set BASE_URL=https://localhost:9090

echo [1] Testing Security Headers...
echo ----------------------------------------
curl.exe -k -s -I %BASE_URL%/api/challenges | findstr /I "Strict-Transport X-Frame Content-Security X-Content-Type Cache-Control"
echo.

echo [2] Testing Rate Limiting on Login (10 attempts allowed per minute)...
echo ----------------------------------------
echo Sending 12 rapid login attempts...
for /L %%i in (1,1,12) do (
    curl.exe -k -s -o nul -w "Attempt %%i: HTTP %%{http_code}\n" -X POST %BASE_URL%/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"wrong\"}"
)
echo Note: Attempts 11 and 12 should return 429 (Too Many Requests)
echo.

echo [3] Testing HTTPS is working...
echo ----------------------------------------
curl.exe -k -s -o nul -w "HTTPS Status: HTTP %%{http_code}\n" %BASE_URL%/api/challenges
echo.

echo [4] Testing that HTTP is rejected (should fail/timeout)...
echo ----------------------------------------
curl.exe -s -o nul -w "HTTP Status: %%{http_code}\n" --connect-timeout 2 http://localhost:9090/api/challenges 2>nul || echo HTTP connection refused (expected - HTTPS only)
echo.

echo ==========================================
echo    Tests Complete
echo ==========================================
echo.
echo To test flag submission rate limiting:
echo 1. Login and get a JWT token
echo 2. Submit 6+ wrong flags rapidly to the same challenge
echo 3. The 6th attempt should return 429
echo.
pause

