# NestJS Backend - README

## Overview

Rally-connect Backend is a NestJS REST API built with:
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe development

## Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── common/
│   │   └── prisma/             # Prisma service & module
│   └── modules/
│       ├── health/             # Health check endpoint
│       ├── sports/             # Sports management
│       ├── leagues/            # Leagues management
│       ├── teams/              # Teams management
│       ├── players/            # Players management
│       ├── matches/            # Matches management
│       └── standings/          # Standings management
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── Dockerfile                  # Docker build
└── .env.development            # Development environment
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Copy the example and update values:

```bash
cp .env.example .env.development
```

### 3. Run with Docker Compose

From the project root:

```bash
docker-compose up --build
```

This will:
- Build and start the backend container
- Start PostgreSQL container
- Run database migrations automatically
- Seed initial data

### 4. Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Set up database (requires local PostgreSQL running)
npx prisma migrate dev

# Seed initial data
npm run prisma:seed

# Start development server
npm run start:dev
```

## Available Endpoints

### Health Check
- `GET /health` - Returns API status and database connection

### Sports
- `GET /sports` - List all sports

### Leagues
- `GET /leagues` - List all leagues
- `GET /leagues/:id` - Get league by ID

### Teams
- `GET /teams` - List all teams
- `GET /teams/:id` - Get team by ID with roster

### Players
- `GET /players` - List all players
- `GET /players/:id` - Get player by ID with stats

### Matches
- `GET /matches` - List all matches
- `GET /matches/:id` - Get match by ID

### Standings
- `GET /standings` - List all standings
- `GET /standings/division/:divisionId` - Get standings for a division

## Database Schema

### Core Entities
- **User** - Authentication and user profiles
- **Sport** - Sports types (Pickleball, Tennis, etc.)
- **League** - Sports leagues
- **Division** - League divisions (Premier, Intermediate, etc.)
- **Team** - Team records with captain and players
- **Player** - Player profiles with stats
- **Match** - Match records and results
- **Standing** - League standings and rankings

See `prisma/schema.prisma` for full schema details.

## Development Commands

```bash
# Start development server with watch
npm run start:dev

# Build for production
npm run build

# Run production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Prisma commands
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio (GUI)
```

## Prisma Studio

View and edit database records with a visual interface:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## API Usage Examples

### Get All Teams

```bash
curl http://localhost:4800/teams
```

### Get Team Details

```bash
curl http://localhost:4800/teams/team-id
```

### Get Standings by Division

```bash
curl http://localhost:4800/standings/division/division-id
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | JWT signing secret | `secret_key` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:4300` |

## Docker Support

### Build Image

```bash
docker build -t rally-backend .
```

### Run Container

```bash
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/rally \
  rally-backend
```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:** Ensure PostgreSQL is running and `DATABASE_URL` is correct.

### Port Already in Use

```
Error: EADDRINUSE: address already in use :::4000
```

**Solution:** Change `APP_PORT` environment variable or kill the process using the port.

### Prisma Errors

```
Error: Prisma cannot access the database
```

**Solution:** 
1. Check database connection string
2. Run `npm run prisma:generate`
3. Run `npm run prisma:migrate`

## Production Deployment

### 1. Build Docker Image

```bash
docker build -t rally-backend:1.0.0 .
```

### 2. Set Production Environment

Update `.env.production` with production credentials.

### 3. Deploy with Docker Compose

See root-level deployment guide.

## Contributing

- Follow NestJS best practices
- Use TypeScript strict mode
- Add unit tests for new features
- Keep services modular and testable
- Use Prisma for all database operations

## Support

For issues or questions, refer to:
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Rally-connect Main README](../README.md)
