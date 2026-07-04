# SVK Sweets Project Setup

This project has three parts:
- Backend: Spring Boot API
- Frontend: Vite + React app
- Database: H2 by default, with optional PostgreSQL support

## 1. Prerequisites

Make sure you have installed:
- Java 17+
- Node.js 18+
- npm

If Maven is not installed globally on your machine, the backend now includes a local launcher, so you can use the project-local command shown below.

## 2. Start the database

This project already uses an embedded H2 database by default, so you do not need to start a separate database server for local development.

### Default option (no separate DB setup needed)
The backend is configured to use H2 in-memory by default.

### Optional PostgreSQL setup
If you want to use PostgreSQL instead:

1. Install and start PostgreSQL.
2. Create a database, for example:
   ```sql
   CREATE DATABASE svksweets;
   ```
3. Set these environment variables before starting the backend:
   ```powershell
   $env:DB_URL="jdbc:postgresql://localhost:5432/svksweets"
   $env:DB_USERNAME="postgres"
   $env:DB_PASSWORD="your_password"
   ```

## 3. Start the backend

Open a terminal in the project root and run:

```powershell
cd backend
./mvn.cmd spring-boot:run
```

If you are using Command Prompt instead of PowerShell, run:

```cmd
cd backend
mvn.cmd spring-boot:run
```

The backend will start at:
- http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## 4. Start the frontend

Open a second terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will start at:
- http://localhost:5173

## 5. Default admin login

The backend seeds an admin account with:
- Username: admin
- Password: admin123

## 6. Useful commands

### Backend
```powershell
cd backend
./mvn.cmd test
./mvn.cmd spring-boot:run
```

### Frontend
```powershell
cd frontend
npm install
npm run build
npm run dev
```

If you want, I can also add a single script to start both backend and frontend together.
