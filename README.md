# Aerostic SaaS Platform

**Aerostic** is a modern, scalable SaaS platform designed for automating business communications via WhatsApp. It features a multi-tenant architecture with a dedicated Tenant Dashboard for users and a comprehensive Admin Panel for platform management.

## 🚀 Tech Stack

-   **Backend**: NestJS (Node.js) - The "Core Brain"
-   **Frontend**: Next.js 14 (App Router, Tailwind CSS)
    -   `app-frontend`: Tenant/User Dashboard
    -   `admin-frontend`: Super Admin Panel
-   **Database**: PostgreSQL 15 (TypeORM)
-   **Queue & Caching**: Redis 7 (BullMQ)
-   **Infrastructure**: Docker Compose, Nginx

## 📂 Project Structure

The project follows a microservices-based monorepo structure:

```
aerostic/
├── services/
│   ├── api/                 # Core Backend API
│   ├── app-frontend/        # User Dashboard (app.aerostic.com)
│   ├── admin-frontend/      # Admin Panel (admin.aerostic.com)
│   ├── webhook-worker/      # Meta Webhook Processor
│   └── message-worker/      # Message Dispatch Queue Consumer
├── infra/                   # Infrastructure Configs (Nginx, Redis, etc.)
├── docker-compose.yml       # Local Development Setup
└── docker-compose.prod.yml  # Production Setup
```

## 🛠️ Getting Started

### Prerequisites

-   Docker & Docker Compose
-   Node.js 18+ (for local tooling)

### Running Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/itsmodassir/The-automation-of-king.git
    cd The-automation-of-king
    ```

2.  **Environment Setup**:
    Copy the example environment file and configure it:
    ```bash
    cp .env.example .env
    ```
    *Update `.env` with your database credentials, Meta App ID, and other secrets.*

3.  **Start Services**:
    ```bash
    docker compose up -d --build
    ```

4.  **Access the Applications**:
    -   **User Dashboard**: [http://localhost:5362](http://localhost:5362)
    -   **Admin Panel**: [http://localhost:53613](http://localhost:53613)
    -   **API**: [http://localhost:53614](http://localhost:53614)

## 🚢 Deployment

For production deployment instructions on AWS (EC2), please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📄 License

This project is licensed under the MIT License.
