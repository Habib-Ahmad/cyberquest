# CTF Platform Security Features

## Overview
This document outlines all security features implemented in the CTF platform.

---

## 1. **HTTPS/TLS Encryption** ✅
- **Implementation**: Self-signed SSL certificate (PKCS12 keystore)
- **Location**: `src/main/resources/keystore.p12`
- **Configuration**: 
  - Port: 9090 (HTTPS only)
  - Key store password: `changeit`
  - Key alias: `tomcat`
- **Purpose**: Encrypts all data in transit between client and server
- **Test**: Access `https://localhost:9090` (HTTP should be rejected)

---

## 2. **JWT (JSON Web Token) Authentication** ✅
- **Implementation**: Custom JWT filter in security chain
- **Token Expiration**: 24 hours (86400000 ms)
- **Secret Key**: Base64-encoded secret stored in `application.properties`
- **Flow**:
  1. User logs in → receives JWT token
  2. Token included in `Authorization: Bearer <token>` header
  3. Filter validates token on each request
  4. Extracts user details and authorities
- **Files**:
  - `JwtUtils.java` - Token generation and validation
  - `AuthTokenFilter.java` - Request interceptor
  - `SecurityConfig.java` - Stateless session management

---

## 3. **BCrypt Password Hashing** ✅
- **Implementation**: Spring Security BCryptPasswordEncoder
- **Strength**: Default (10 rounds)
- **Purpose**: Securely stores user passwords (never plain text)
- **Location**: `SecurityConfig.java` - `passwordEncoder()` bean

---

## 4. **Rate Limiting** ✅
- **Library**: Bucket4j (Token Bucket Algorithm)
- **Limits**:
  - **Login Attempts**: 10 per minute per IP address
  - **Flag Submissions**: 5 per minute per user
- **Implementation**: `RateLimitingService.java`
- **Response**: HTTP 429 (Too Many Requests) when exceeded
- **Purpose**: Prevents brute force attacks and flag guessing

---

## 5. **Role-Based Access Control (RBAC)** ✅
- **Roles**: `ROLE_USER`, `ROLE_ADMIN`
- **Protected Endpoints**:
  - **Admin Only**:
    - `POST /api/challenges` - Create challenge
    - `PUT /api/challenges/{id}` - Update challenge
    - `DELETE /api/challenges/{id}` - Delete challenge
  - **Authenticated Users**:
    - `POST /api/challenges/{id}/submit` - Submit flag
    - `GET /api/submissions` - View own submissions
- **Public Endpoints**:
  - `POST /api/auth/signup` - Register
  - `POST /api/auth/signin` - Login
  - `GET /api/challenges` - List challenges
  - `GET /api/challenges/{id}` - View challenge
  - `GET /api/leaderboard` - View leaderboard
  - Swagger UI documentation

---

## 6. **Security Headers** ✅
Configured in `SecurityConfig.java`:

### a. **Strict-Transport-Security (HSTS)**
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Forces HTTPS for 1 year

### b. **X-Frame-Options**
- `X-Frame-Options: DENY`
- Prevents clickjacking attacks

### c. **Content-Security-Policy (CSP)**
- `Content-Security-Policy: default-src 'self'; frame-ancestors 'none';`
- Restricts resource loading to same origin

### d. **X-Content-Type-Options**
- `X-Content-Type-Options: nosniff`
- Prevents MIME type sniffing (implicit via Spring Security)

### e. **Secure & HttpOnly Cookies**
- Session cookies marked as `Secure` and `HttpOnly`
- Prevents XSS cookie theft

---

## 7. **Input Validation** ✅
- **Library**: Jakarta Validation (Bean Validation)
- **Validations**:
  - Username: Not blank, sanitized
  - Email: Valid format
  - Password: Not blank, minimum length
  - Challenge fields: Not null/blank, enum constraints
  - Flag: Not blank
- **Location**: DTOs in `payload/request/` package
- **Error Handling**: `GlobalExceptionHandler.java`

---

## 8. **SQL Injection Prevention** ✅
- **ORM**: Spring Data JPA / Hibernate
- **Repositories**: Use parameterized queries automatically
- **No Raw SQL**: All queries use repository methods
- **Location**: `repositories/` package

---

## 9. **CORS Configuration** ✅
- **Implementation**: Centralized in `SecurityConfig.java`
- **Allowed Origins**: `*` (for development - should restrict in production)
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers**: All
- **Exposed Headers**: Authorization
- **Purpose**: Enables controlled cross-origin requests

---

## 10. **Flag Hashing** ✅
- **Implementation**: BCrypt hashing for challenge flags
- **Storage**: Only flag hash stored in database, never plain text
- **Validation**: Submitted flags are hashed and compared
- **Location**: `ChallengeService.java` - `createChallenge()` and `SubmissionService.java`

---

## 11. **Exception Handling** ✅
- **Global Handler**: `GlobalExceptionHandler.java`
- **Handles**:
  - Validation errors (400)
  - Rate limit exceeded (429)
  - Authentication errors (401)
  - Authorization errors (403)
  - Not found errors (404)
  - Duplicate entries (409)
- **Purpose**: Prevents information leakage via stack traces

---

## 12. **Database Security** ✅
- **Connection**: Credentials in `application.properties` (should use env vars in production)
- **User**: Dedicated database user `ctf_user` with limited privileges
- **Schema Management**: Flyway migrations for version control
- **Password Validation**: No raw passwords stored

---

## Testing Security Features

### Prerequisites
1. Start the server: `.\mvnw.cmd spring-boot:run`
2. Ensure PostgreSQL is running (via Docker Compose)

### Run Automated Tests
```cmd
.\test-security.bat
```

### Manual Tests

#### Test 1: HTTPS Enforcement
```cmd
# Should work
curl -k https://localhost:9090/api/challenges

# Should fail/timeout
curl http://localhost:9090/api/challenges
```

#### Test 2: Security Headers
```cmd
curl -k -I https://localhost:9090/api/challenges
```
Look for:
- `Strict-Transport-Security`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `X-Content-Type-Options`

#### Test 3: Login Rate Limiting
```cmd
# Send 12 rapid login attempts (10 allowed per minute)
for /L %i in (1,1,12) do curl -k -X POST https://localhost:9090/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"wrong\"}"
```
Attempts 11-12 should return HTTP 429.

#### Test 4: Flag Submission Rate Limiting
1. Login and get JWT token:
```cmd
curl -k -X POST https://localhost:9090/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"password\"}"
```

2. Extract token from response, then:
```cmd
# Send 6 rapid flag submissions (5 allowed per minute)
for /L %i in (1,1,6) do curl -k -X POST https://localhost:9090/api/challenges/{CHALLENGE_ID}/submit -H "Authorization: Bearer {TOKEN}" -H "Content-Type: application/json" -d "{\"flag\":\"wrong\"}"
```
6th attempt should return HTTP 429.

#### Test 5: Authentication
```cmd
# Without token - should get 401
curl -k https://localhost:9090/api/submissions

# With valid token - should work
curl -k -H "Authorization: Bearer {TOKEN}" https://localhost:9090/api/submissions
```

#### Test 6: Authorization (RBAC)
```cmd
# Regular user trying to create challenge - should get 403
curl -k -X POST https://localhost:9090/api/challenges -H "Authorization: Bearer {USER_TOKEN}" -H "Content-Type: application/json" -d "{...}"

# Admin creating challenge - should work
curl -k -X POST https://localhost:9090/api/challenges -H "Authorization: Bearer {ADMIN_TOKEN}" -H "Content-Type: application/json" -d "{...}"
```

#### Test 7: SQL Injection Prevention
```cmd
# Try SQL injection in username - should be safely handled
curl -k -X POST https://localhost:9090/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"admin' OR '1'='1\",\"password\":\"test\"}"
```
Should return authentication error, not SQL error.

#### Test 8: Input Validation
```cmd
# Submit invalid data - should get 400 with validation errors
curl -k -X POST https://localhost:9090/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"\",\"email\":\"invalid\",\"password\":\"\"}"
```

---

## Production Recommendations

### High Priority
1. **Environment Variables**: Move sensitive config to env vars
   - Database credentials
   - JWT secret key
   - SSL keystore password

2. **CORS**: Restrict allowed origins to your frontend domain
   ```java
   configuration.setAllowedOrigins(List.of("https://yourdomain.com"));
   ```

3. **SSL Certificate**: Replace self-signed cert with CA-signed certificate
   - Use Let's Encrypt for free SSL
   - Update keystore with production certificate

4. **Rate Limiting**: Consider more sophisticated limits
   - Different limits for different endpoints
   - Distributed rate limiting with Redis for multi-instance deployments

### Medium Priority
5. **Logging**: Add security event logging
   - Failed login attempts
   - Rate limit violations
   - Admin actions

6. **Password Policy**: Enforce stronger passwords
   - Minimum length (12+ characters)
   - Complexity requirements
   - Password strength meter

7. **Account Lockout**: Lock account after N failed attempts

8. **Session Management**: Add token refresh mechanism

### Nice to Have
9. **Two-Factor Authentication (2FA)**
10. **Email Verification** for registration
11. **CAPTCHA** for login/registration
12. **Security Audit Logging**
13. **Content Security Policy Reporting**

---

## Security Checklist

- [x] HTTPS/TLS encryption
- [x] JWT authentication
- [x] Password hashing (BCrypt)
- [x] Rate limiting (login + flag submission)
- [x] RBAC with admin/user roles
- [x] Security headers (HSTS, CSP, X-Frame-Options, etc.)
- [x] Input validation
- [x] SQL injection prevention (ORM)
- [x] CORS configuration
- [x] Flag hashing
- [x] Global exception handling
- [x] Secure session cookies
- [ ] Environment-based configuration (TODO for production)
- [ ] CA-signed SSL certificate (TODO for production)
- [ ] Security audit logging (TODO for production)

---

## Architecture Notes

### Security Flow
```
Client Request
    ↓
[HTTPS/TLS Layer]
    ↓
[CORS Filter]
    ↓
[Security Filter Chain]
    ↓
[Rate Limiting Check] → Reject if exceeded (429)
    ↓
[JWT Token Validation] → Reject if invalid (401)
    ↓
[Authorization Check] → Reject if forbidden (403)
    ↓
[Input Validation] → Reject if invalid (400)
    ↓
[Controller Logic]
    ↓
[Service Layer] → BCrypt for passwords/flags
    ↓
[Repository Layer] → JPA (SQL injection safe)
    ↓
[Database]
```

### Defense in Depth
Multiple layers protect against common attacks:
- **DDoS**: Rate limiting
- **Brute Force**: Rate limiting + BCrypt
- **Session Hijacking**: HTTPS + Secure cookies + JWT expiration
- **XSS**: CSP headers + HttpOnly cookies + Input sanitization
- **CSRF**: Disabled (stateless JWT, not cookie-based)
- **Clickjacking**: X-Frame-Options
- **SQL Injection**: JPA/Hibernate parameterized queries
- **Man-in-the-Middle**: HTTPS + HSTS

---

## Contact & Support
For security concerns or vulnerabilities, please report immediately.

