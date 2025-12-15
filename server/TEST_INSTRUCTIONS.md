# Security Testing Instructions

## Prerequisites

### 1. Start Docker Desktop
Docker Desktop must be running for PostgreSQL database connectivity.

**Steps:**
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray should be steady)
3. Verify with: `docker ps`

### 2. Start the Server
Once Docker is running:
```cmd
.\mvnw.cmd spring-boot:run
```

Wait for the application to fully start. You should see:
```
Tomcat started on port 9090 (https) with context path '/'
Started DemoApplication in X seconds
```

---

## Automated Security Tests

### Run Test Script
```cmd
.\test-security.bat
```

### Expected Results

#### Test 1: Security Headers ✅
Should display:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; frame-ancestors 'none';
X-Content-Type-Options: nosniff
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
```

#### Test 2: Login Rate Limiting ✅
Should display:
```
Attempt 1: HTTP 401
Attempt 2: HTTP 401
...
Attempt 10: HTTP 401
Attempt 11: HTTP 429  <-- Rate limit exceeded
Attempt 12: HTTP 429  <-- Rate limit exceeded
```

#### Test 3: HTTPS Working ✅
```
HTTPS Status: HTTP 200
```

#### Test 4: HTTP Rejected ✅
```
HTTP connection refused (expected - HTTPS only)
```

---

## Manual Security Tests

### Test 1: Authentication & Authorization

#### 1a. Register a User
```cmd
curl -k -X POST https://localhost:9090/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```
**Expected:** `User registered successfully!`

#### 1b. Login
```cmd
curl -k -X POST https://localhost:9090/api/auth/signin ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"password\":\"password123\"}"
```
**Expected:** JSON with `jwt` token and user info

#### 1c. Access Protected Endpoint Without Token
```cmd
curl -k https://localhost:9090/api/submissions
```
**Expected:** HTTP 401 Unauthorized

#### 1d. Access Protected Endpoint With Token
```cmd
curl -k -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" ^
  https://localhost:9090/api/submissions
```
**Expected:** HTTP 200 with submissions data

---

### Test 2: Role-Based Access Control

#### 2a. Login as Admin
```cmd
curl -k -X POST https://localhost:9090/api/auth/signin ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"password\"}"
```
Save the JWT token.

#### 2b. Create Challenge (Admin Only)
```cmd
curl -k -X POST https://localhost:9090/api/challenges ^
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Challenge\",\"description\":\"Description\",\"category\":\"WEB\",\"difficulty\":\"EASY\",\"points\":100,\"flag\":\"CTF{test}\"}"
```
**Expected:** HTTP 200 with challenge details

#### 2c. Try Creating Challenge as Regular User
```cmd
curl -k -X POST https://localhost:9090/api/challenges ^
  -H "Authorization: Bearer USER_JWT_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test\",\"description\":\"Test\",\"category\":\"WEB\",\"difficulty\":\"EASY\",\"points\":100,\"flag\":\"CTF{test}\"}"
```
**Expected:** HTTP 403 Forbidden

---

### Test 3: Flag Submission Rate Limiting

#### 3a. Get a Challenge ID
```cmd
curl -k https://localhost:9090/api/challenges
```
Copy a challenge UUID from the response.

#### 3b. Submit 6 Wrong Flags Rapidly
```cmd
for /L %i in (1,1,6) do @curl -k -X POST https://localhost:9090/api/challenges/CHALLENGE_ID/submit -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"flag\":\"wrong\"}" -w "\nAttempt %i: HTTP %%{http_code}\n" -s
```

**Expected:**
```
Attempt 1: HTTP 200 (incorrect flag)
Attempt 2: HTTP 200 (incorrect flag)
Attempt 3: HTTP 200 (incorrect flag)
Attempt 4: HTTP 200 (incorrect flag)
Attempt 5: HTTP 200 (incorrect flag)
Attempt 6: HTTP 429 (rate limit exceeded)
```

---

### Test 4: Input Validation

#### 4a. Empty Username
```cmd
curl -k -X POST https://localhost:9090/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"\",\"email\":\"test@test.com\",\"password\":\"pass123\"}"
```
**Expected:** HTTP 400 with validation errors

#### 4b. Invalid Email
```cmd
curl -k -X POST https://localhost:9090/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test\",\"email\":\"not-an-email\",\"password\":\"pass123\"}"
```
**Expected:** HTTP 400 with validation errors

#### 4c. Empty Password
```cmd
curl -k -X POST https://localhost:9090/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"\"}"
```
**Expected:** HTTP 400 with validation errors

---

### Test 5: SQL Injection Prevention

#### 5a. SQL Injection in Username
```cmd
curl -k -X POST https://localhost:9090/api/auth/signin ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin' OR '1'='1\",\"password\":\"anything\"}"
```
**Expected:** HTTP 401 authentication error (NOT SQL error)

#### 5b. SQL Injection in Search
```cmd
curl -k "https://localhost:9090/api/challenges?category=WEB' OR '1'='1"
```
**Expected:** HTTP 400 or proper error handling (NOT SQL error)

---

### Test 6: Password Security

#### 6a. Check Password is Hashed
Connect to database:
```cmd
docker exec -it postgres-db psql -U ctf_user -d ctf_db
```

Query users:
```sql
SELECT username, password FROM users WHERE username = 'admin';
```

**Expected:** Password should be BCrypt hash starting with `$2a$` or `$2b$`
**NOT Expected:** Plain text password

Exit: `\q`

---

### Test 7: Flag Security

#### 7a. Check Flag is Hashed in Database
```sql
SELECT title, flag_hash FROM challenges LIMIT 1;
```

**Expected:** `flag_hash` is a BCrypt hash
**NOT Expected:** Plain text flag like "CTF{...}"

---

### Test 8: CORS Configuration

#### 8a. Test from Browser Console
Open browser to `https://localhost:9090/swagger-ui.html`

Open Developer Console (F12) and run:
```javascript
fetch('https://localhost:9090/api/challenges', {
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
})
.then(r => r.json())
.then(d => console.log('CORS works:', d))
.catch(e => console.error('CORS error:', e));
```

**Expected:** Data returned successfully
**NOT Expected:** CORS policy error

---

### Test 9: Swagger Authentication

#### 9a. Access Swagger UI
Open: `https://localhost:9090/swagger-ui.html`

Click "Authorize" button (lock icon)

#### 9b. Get JWT Token
Login via curl or Swagger:
```cmd
curl -k -X POST https://localhost:9090/api/auth/signin ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"password\"}"
```

#### 9c. Authorize in Swagger
In Swagger UI:
1. Click "Authorize"
2. Enter: `Bearer YOUR_JWT_TOKEN`
3. Click "Authorize"
4. Try protected endpoints (should work now)

---

### Test 10: Session Security

#### 10a. Token Expiration
JWT tokens expire after 24 hours. To test:
1. Login and save token
2. Wait 24+ hours (or modify `app.jwtExpirationMs` in properties to 60000 for 1 minute)
3. Try accessing protected endpoint with expired token

**Expected:** HTTP 401 Unauthorized

#### 10b. Invalid Token
```cmd
curl -k -H "Authorization: Bearer invalid_token_here" ^
  https://localhost:9090/api/submissions
```
**Expected:** HTTP 401 Unauthorized

---

## Security Checklist

Use this checklist to verify all security features:

- [ ] **HTTPS Working**: Can access via https://localhost:9090
- [ ] **HTTP Rejected**: Cannot access via http://localhost:9090
- [ ] **Security Headers Present**: Strict-Transport-Security, X-Frame-Options, CSP, etc.
- [ ] **JWT Authentication**: Protected endpoints require valid token
- [ ] **JWT Expiration**: Expired tokens are rejected
- [ ] **Role-Based Access**: Admin endpoints reject regular users
- [ ] **Login Rate Limiting**: 11th attempt returns 429
- [ ] **Flag Submission Rate Limiting**: 6th attempt returns 429
- [ ] **Input Validation**: Empty/invalid inputs return 400
- [ ] **SQL Injection Prevention**: SQL injection attempts fail safely
- [ ] **Password Hashing**: Passwords stored as BCrypt hashes
- [ ] **Flag Hashing**: Flags stored as BCrypt hashes
- [ ] **CORS Working**: Cross-origin requests work from Swagger UI
- [ ] **Public Endpoints**: Can access /api/challenges without auth
- [ ] **Protected Endpoints**: Cannot access /api/submissions without auth
- [ ] **Error Handling**: Errors return proper HTTP codes, not stack traces

---

## Common Issues & Solutions

### Issue: Docker not running
**Error:** `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`
**Solution:** Start Docker Desktop and wait for it to fully initialize

### Issue: Port already in use
**Error:** `Port 9090 is already in use`
**Solution:** 
```cmd
netstat -ano | findstr :9090
taskkill /PID <PID> /F
```

### Issue: SSL certificate warning
**Error:** Browser shows "Your connection is not private"
**Solution:** This is expected with self-signed certificate. Click "Advanced" → "Proceed anyway" or use `-k` flag with curl

### Issue: Database connection failed
**Error:** `Connection refused` or `PSQLException`
**Solution:** 
```cmd
docker-compose up -d
docker ps  # Verify postgres-db is running
```

### Issue: Rate limiting not working
**Solution:** Rate limit buckets are per-user/per-IP and reset after 1 minute. Wait 60 seconds and try again.

---

## Performance Testing (Optional)

### Load Test with Apache Bench
```cmd
# Install Apache Bench (comes with Apache HTTP Server)
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T "application/json" -k https://localhost:9090/api/auth/signin
```

Where `login.json` contains:
```json
{"username":"testuser","password":"password123"}
```

---

## Security Best Practices Verified

1. ✅ **Encryption in Transit**: HTTPS/TLS with HSTS
2. ✅ **Authentication**: JWT-based stateless authentication
3. ✅ **Authorization**: Role-based access control (RBAC)
4. ✅ **Password Security**: BCrypt hashing with salt
5. ✅ **Rate Limiting**: Prevents brute force attacks
6. ✅ **Input Validation**: Bean validation on all inputs
7. ✅ **SQL Injection Prevention**: JPA/Hibernate parameterized queries
8. ✅ **XSS Prevention**: CSP headers + HttpOnly cookies
9. ✅ **Clickjacking Prevention**: X-Frame-Options
10. ✅ **MIME Type Sniffing Prevention**: X-Content-Type-Options
11. ✅ **Session Security**: Secure + HttpOnly cookies
12. ✅ **Error Handling**: No stack trace exposure
13. ✅ **CORS Configuration**: Controlled cross-origin access
14. ✅ **Flag Security**: Hashed storage, secure comparison

---

## Next Steps for Production

See `SECURITY_FEATURES.md` for production deployment recommendations including:
- Environment variable configuration
- CA-signed SSL certificates
- Restricted CORS origins
- Enhanced logging
- Account lockout policies
- Two-factor authentication

