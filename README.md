# Adonis Health

**Adonis Health** is a premium telemedicine platform for men's hormone optimization and executive wellness.

## Tech Stack

### Frontend (User & Provider Portals)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Design System**: "Adonis Gold" (Integrated from v0.app)
- **Key Features**: High-performance landing page, animated gradients, treatments showcase.

### Backend (API & Logic)
- **Framework**: NestJS 11
- **Database**: SQLite (Local Dev) / PostgreSQL (Production)
- **ORM**: Prisma 5.22
- **Authentication**: JWT + Passport + RBAC (Roles: Admin, Patient, Provider)

### AI-Powered Telehealth (Planned)
- **Pre-Visit Briefing**: AI-synthesized patient context before encounters
- **Lab Analysis**: Interpretation by physiological system with pattern detection
- **Symptom Correlation**: Links subjective check-in data with objective labs
- **Encounter Support**: Zoom integration with real-time context panel
- **Post-Encounter AI**: Automated SOAP note completion with provider review

See [docs/AI_TELEHEALTH_SPEC.md](docs/AI_TELEHEALTH_SPEC.md) for full specification.

## Project Structure

```
├── api/                 # NestJS backend
│   ├── src/
│   │   ├── auth/        # Authentication (Login, Register, Guards)
│   │   ├── concierge/   # Check-ins, Patient Management
│   │   ├── patients/    # Patient Profiles, Labs, Notes
│   │   ├── prisma/      # Database Connection
│   │   └── ...
│   └── prisma/
│       └── schema.prisma # DB Schema (SQLite)
├── web/                 # Next.js frontend
│   ├── app/             # App Router pages
│   ├── components/      # Shadcn & Custom v0 Components
│   └── lib/             # Utils & Hooks
├── docs/                # Technical Documentation
│   └── AI_TELEHEALTH_SPEC.md  # AI Telehealth System Spec
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- (Optional) Docker for PostgreSQL production

### Quick Start (Local Development)

1. **Backend (API)**
   ```bash
   cd api
   npm install
   # Initialize SQLite DB
   npx prisma migrate dev --name init
   # Start Server (Port 3001)
   npm run start:dev
   ```

2. **Frontend (Web)**
   ```bash
   cd web
   npm install
   # Start Server (Port 3000)
   npm run dev
   ```

3. **Verify**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001](http://localhost:3001)

## Environment Variables

### API (`api/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecret_dev_key"
PORT=3001
```

### Web (`web/.env.local`)
*(None currently required)*

## Design Updates (v0.app)

The frontend design is powered by **v0.app**. To update the design:
1. Export the project from v0.app as a zip.
2. Place `adonis-health-platform.zip` in the root directory.
3. Run the sync workflow (see `.agent/workflows/sync_v0_design.md`).

## License

UNLICENSED - Private repository
