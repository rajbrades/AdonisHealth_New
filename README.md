# Adonis Health

A modern healthcare platform for managing patient lab results, provider reviews, and product orders.

## Tech Stack

### Backend (API)
- **Framework:** NestJS 11
- **Database:** PostgreSQL 15 (Docker) / SQLite (development)
- **ORM:** Prisma 5.22
- **Language:** TypeScript 5

### Frontend (Web)
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI, shadcn/ui

## Project Structure

```
├── api/                 # NestJS backend
│   ├── src/
│   │   ├── prisma/      # Prisma module & service
│   │   └── ...
│   └── prisma/
│       └── schema.prisma
├── web/                 # Next.js frontend
│   ├── app/
│   ├── components/
│   └── lib/
└── docker-compose.yml   # PostgreSQL database
```

## Data Models

- **User** - Authentication with roles (Admin, Patient, Provider)
- **PatientProfile** - Patient demographics and information
- **ProviderProfile** - Healthcare provider details
- **LabResult** - Lab test results with review status
- **Biomarker** - Individual lab values with reference ranges
- **Product** - Supplements, prescriptions, and lab tests
- **Order / OrderItem** - E-commerce order management
- **AuditLog** - HIPAA-compliant activity logging

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Setup

1. **Start the database:**
   ```bash
   docker-compose up -d
   ```

2. **Install API dependencies:**
   ```bash
   cd api
   npm install
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the API server:**
   ```bash
   npm run start:dev
   ```

5. **Install Web dependencies:**
   ```bash
   cd ../web
   npm install
   ```

6. **Start the web development server:**
   ```bash
   npm run dev
   ```

### Available Scripts

#### API
| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint and fix code |

#### Web
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint code |

## Environment Variables

### API (`api/.env`)
```env
DATABASE_URL="file:./dev.db"
```

For PostgreSQL (production):
```env
DATABASE_URL="postgresql://adonis:password123@localhost:5432/adonis_db"
```

## License

UNLICENSED - Private repository
