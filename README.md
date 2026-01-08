# CyberQuest - CTF Platform

A modern Capture The Flag (CTF) platform for cybersecurity education and competitions. Challenge yourself with puzzles across cryptography, web security, forensics, and more.

## Features

- **Challenge Categories**

  - Cryptography (Caesar cipher, RSA, Base64, etc.)
  - Web Security (XSS, SQL injection, command injection)
  - Forensics (steganography, network analysis)
  - Network Security
  - Reverse Engineering

- **User Features**

  - User registration and authentication (JWT-based)
  - Challenge browsing with category/difficulty filters
  - Flag submission with rate limiting
  - Real-time leaderboard with scoring
  - Personal profile and submission history
  - File attachments for challenges

- **Security Features**

  - Secure password hashing (BCrypt)
  - JWT authentication with refresh tokens
  - HTTPS/TLS encryption
  - Rate limiting on flag submissions
  - SQL injection protection
  - XSS protection

- **Admin Features**
  - Challenge creation and management
  - User management
  - Submission monitoring

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend

- **Spring Boot 4.0** (Java 21)
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL 16** database
- **Flyway** for database migrations
- **BCrypt** for password hashing
- **Swagger/OpenAPI** documentation

### Infrastructure

- **Docker & Docker Compose** for containerization
- **Maven** for Java build
- **pgAdmin** for database management

## Quick Start

### Prerequisites

- Docker Desktop installed
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Habib-Ahmad/cyberquest.git
   cd cyberquest
   ```

2. **Start all services**

   ```bash
   docker-compose up
   ```

   This will start:

   - Frontend (React/Vite) on `http://localhost:5173`
   - Backend (Spring Boot) on `https://localhost:9090`
   - PostgreSQL database on `localhost:5433`
   - pgAdmin on `http://localhost:5051`

3. **Access the application**

   - **Main App**: http://localhost:5173
   - **API Docs**: https://localhost:9090/swagger-ui.html
   - **Database Admin**: http://localhost:5051 (admin@admin.com / admin)

4. **Create your first account**
   - Navigate to http://localhost:5173
   - Click "Sign Up"
   - Register a new account
   - Start solving challenges!

## Available Challenges

The platform comes pre-seeded with:

- **6 challenges** including:
  - Base64 Secret Decode (Crypto, Easy)
  - Hidden Cat (Forensics, Easy)
  - Hidden Network Treasure (Forensics, Medium) - _requires deployment_
  - Stored Comment Injector (Web, Medium) - _requires deployment_
  - Hidden Key Cookie Forge (Web, Hard) - _requires deployment_
  - Hard RSA Full (Crypto, Hard) - _requires deployment_

## Development

### Project Structure

```
software-security-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context (auth, theme)
│   │   └── types/         # TypeScript types
│   └── Dockerfile.dev
├── server/                # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/demo/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── models/
│   │       ├── repositories/
│   │       └── security/
│   ├── uploads/          # Challenge attachments
│   └── Dockerfile.dev
├── docker-compose.yml    # Development orchestration
└── README.md
```

### Running in Development

**Option 1: Docker (Recommended)**

```bash
docker-compose up
```

**Option 2: Local Development**

```bash
# Terminal 1 - Start database
docker-compose up db

# Terminal 2 - Start backend
cd server
./mvnw spring-boot:run

# Terminal 3 - Start frontend
cd client
npm install
npm run dev
```

## Default Credentials

**Database**

- Username: `ctf_user`
- Password: `ctf_password`
- Database: `ctf_db`

**pgAdmin**

- Email: `admin@admin.com`
- Password: `admin`

## API Documentation

Once the backend is running, access the Swagger UI at:

- https://localhost:9090/swagger-ui.html

**Happy Hacking!**
