# NexusPlay Backend

High-performance modular backend for the NexusPlay Gaming Platform, built with FastAPI, Async SQLAlchemy, and PostgreSQL.

## Features
- **Modular Hexagonal Architecture**: Separation of concerns by domain (Auth, Agent, Affiliate, Wallet).
- **FastAPI**: 300% performance boost over traditional frameworks.
- **Async SQL**: Non-blocking database operations with SQLAlchemy 2.0.
- **Auto-Documentation**: Swagger UI & ReDoc built-in.
- **Docker Ready**: Production-grade containerization.

## Setup Instructions

### 1. Environment
Create a `.env` file in the `backend/` directory:
```bash
cp .env.example .env
```

### 2. Local Development
Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn app.main:app --reload
```
Access docs at: `http://localhost:8000/docs`

### 3. Database Migrations
Run migrations to set up the schema:
```bash
alembic upgrade head
```

### 4. Docker
```bash
docker build -t nexusplay-backend .
docker run -p 8000:8000 nexusplay-backend
```

## API Modules
- **/auth**: Login, Register (Agents/Affiliates).
- **/agent**: Agent dashboard, User management, Commissions.
- **/affiliate**: Tracking links, Stats, Payouts.
