# Adonis Health

**Adonis Health** is a premium telemedicine platform for men's hormone optimization and executive wellness. This repository contains the full-stack application, including the frontend patient and provider portals, and the backend API.

---

## Features

- **HIPAA-Compliant Authentication**: Secure user registration and login with JWT, RBAC, password validation, and comprehensive audit logging.
- **AI-Powered Lab Analysis**: Automated extraction and interpretation of lab results from PDF reports.
- **Patient & Provider Portals**: Dedicated interfaces for patients to manage their health and for providers to manage their patients.
- **Telehealth Encounter System**: Planned integration with Zoom for real-time video consultations.
- **Automated Clinical Notes**: AI-assisted SOAP note generation to streamline provider workflows.

---

## Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | High-performance patient and provider portals. |
| **Styling** | Tailwind CSS + Shadcn UI | Modern, responsive, and accessible user interfaces. |
| **Backend** | NestJS 11 | Scalable and maintainable server-side application. |
| **Database** | PostgreSQL (Production) | Reliable and robust relational database. |
| **ORM** | Prisma 5.22 | Type-safe database access and schema management. |
| **Authentication** | JWT + Passport.js | Secure, token-based authentication with role-based access control. |
| **AI Services** | Anthropic Claude | AI-powered lab analysis and clinical note generation. |

---

## Project Structure

```
AdonisHealth_New/
├── api/                 # NestJS backend API
│   ├── src/
│   │   ├── auth/        # HIPAA-compliant authentication
│   │   ├── labs/        # AI-powered lab analysis
│   │   ├── patients/    # Patient profile management
│   │   └── ...
│   └── prisma/          # Database schema and migrations
├── web/                 # Next.js frontend application
│   ├── app/             # App Router pages and layouts
│   ├── components/      # Reusable UI components
│   └── lib/             # Utility functions and hooks
├── docs/                # Project documentation
│   ├── API_DOCUMENTATION.md
│   ├── HIPAA_COMPLIANCE.md
│   └── ...
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL in production)

### Quick Start (Local Development)

1.  **Clone the repository:**
    ```bash
    gh repo clone rajbrades/AdonisHealth_New
    cd AdonisHealth_New
    ```

2.  **Configure Backend (API):**
    ```bash
    cd api
    cp .env.example .env
    # Edit .env with your local settings (e.g., JWT_SECRET)
    npm install
    npx prisma migrate dev --name init
    npm run start:dev
    ```
    The API will be running at `http://localhost:3001`.

3.  **Configure Frontend (Web):**
    ```bash
    cd ../web
    npm install
    npm run dev
    ```
    The web application will be running at `http://localhost:3000`.

---

## API Overview

The backend API is built with NestJS and provides a comprehensive set of endpoints for managing users, patients, labs, and more. All endpoints are secured with our HIPAA-compliant authentication system.

For detailed information on all available endpoints, request schemas, and response formats, please refer to the [API Documentation](docs/API_DOCUMENTATION.md).

### Authentication API

The authentication API provides endpoints for:
- User registration and login
- Secure session management with JWT
- Password management
- Role-based access control

---

## Environment Variables

This project uses environment variables for configuration. A complete list of required variables can be found in the `.env.example` file in the `api` directory.

### Key Variables

- `DATABASE_URL`: The connection string for your database.
- `JWT_SECRET`: A secure, random string for signing JWT tokens.
- `ANTHROPIC_API_KEY`: Your API key for Anthropic Claude.

---

## License

This project is unlicensed and is a private repository.
