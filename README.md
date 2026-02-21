# Aigine - AI Agents Orchestration Platform

A production-ready landing page with custom analytics system for an AI agents orchestration product.

## Features

### Landing Page
- Modern, responsive design with TailwindCSS
- Hero section with dual CTAs
- Social proof section
- How it works workflow visualization
- Demo video section
- Enterprise features showcase
- Tiered pricing with early access rates
- FAQ section
- Lead capture with qualification

### Analytics System
- Custom analytics implementation (no external services)
- Page views and unique visitor tracking
- Scroll depth tracking (25/50/75/90/100%)
- Section visibility tracking with IntersectionObserver
- Click heatmap data collection
- CTA and form funnel tracking
- Bot detection and filtering
- Rate limiting per IP/visitor

### Admin Dashboard
- Protected admin area with JWT authentication
- Overview metrics (visitors, leads, conversion rates)
- Lead management with filtering and CSV export
- Analytics charts and visualizations
- Click heatmap viewer
- Retention metrics

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Analytics**: Custom implementation with batching
- **Deployment**: Docker + Docker Compose

## Setup Instructions

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm or yarn

### Local Development

1. **Clone the repository and install dependencies:**

```bash
cd aigine
npm install
```

2. **Copy environment variables:**

```bash
cp .env.example .env
```

3. **Update `.env` with your values:**

```env
DATABASE_URL=postgresql://aigine:aigine_password@localhost:5432/aigine_db?schema=public
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
SESSION_SECRET=your-32-character-secret-key
IP_HASH_SALT=your-salt-for-ip-hashing
```

4. **Start PostgreSQL with Docker:**

```bash
docker-compose up -d postgres
```

5. **Run database migrations:**

```bash
npx prisma migrate dev
```

6. **Start the development server:**

```bash
npm run dev
```

Visit http://localhost:3000 to see the landing page.

### Production Deployment with Docker

1. **Build and run with Docker Compose:**

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Build the Next.js application
- Run database migrations
- Start the app on port 3000

2. **Access the application:**
- Landing page: http://localhost:3000
- Admin login: http://localhost:3000/admin
- Default credentials: Check your `.env` file

### Database Migrations

**Create a new migration:**
```bash
npx prisma migrate dev --name your_migration_name
```

**Apply migrations in production:**
```bash
npx prisma migrate deploy
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

## Admin Dashboard

### Accessing the Admin Area

1. Navigate to `/admin`
2. Login with credentials from environment variables
3. Access features:
   - **Overview**: Key metrics and KPIs
   - **Leads**: View, filter, and export lead data
   - **Analytics**: Time-series charts and funnel analysis
   - **Heatmap**: Visual click distribution

### Admin Features

- **Metrics Overview**: Visitors today/week/month, conversion rates
- **Lead Management**: Filter by plan/urgency, export to CSV
- **Analytics Charts**: Page views, conversion funnels, scroll depth
- **Heatmap Visualization**: Click patterns on landing page

## How Analytics Works

### Client-Side Tracking

The analytics client (`/lib/analytics/client.ts`) automatically:
1. Generates visitor and session IDs using cookies
2. Tracks page views with viewport and referrer data
3. Monitors scroll depth at 25%, 50%, 75%, 90%, 100%
4. Observes section visibility using IntersectionObserver
5. Captures all clicks with normalized coordinates
6. Batches events and flushes every 5 seconds or 10 events
7. Uses `navigator.sendBeacon` on page unload

### Server-Side Processing

The tracking endpoint (`/api/track`) handles:
1. Rate limiting (100 requests/minute per visitor)
2. Bot filtering based on user agent
3. IP hashing for privacy
4. Visitor and session management
5. Event storage in PostgreSQL

### Privacy & Compliance

- No PII stored in events
- IPs are hashed, never stored raw
- First-party cookies only
- Bot traffic filtered
- GDPR-friendly implementation

## API Endpoints

### Public Endpoints

- `POST /api/track` - Event tracking
- `POST /api/lead` - Lead submission

### Admin Endpoints (Protected)

- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Session termination
- `GET /api/admin/leads` - Fetch leads with filtering

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| `ADMIN_USER` | Admin dashboard username | admin |
| `ADMIN_PASS` | Admin dashboard password | secure-password-123 |
| `SESSION_SECRET` | JWT signing secret (32+ chars) | your-very-long-secret-key |
| `IP_HASH_SALT` | Salt for IP hashing | random-salt-string |
| `DEMO_VIDEO_URL` | Optional demo video URL | https://example.com/demo.mp4 |

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:
1. Ensure PostgreSQL is running: `docker-compose ps`
2. Check connection string in `.env`
3. Verify network connectivity: `docker-compose logs postgres`

### Build Errors

If the build fails:
1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Ensure all dependencies are installed

### Analytics Not Working

If analytics events aren't being tracked:
1. Check browser console for errors
2. Verify cookies are enabled
3. Check rate limiting hasn't been triggered
4. Ensure you're not being detected as a bot

## Production Checklist

- [ ] Change all default passwords in `.env`
- [ ] Use strong `SESSION_SECRET` (32+ characters)
- [ ] Configure proper `DATABASE_URL` for production
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx/caddy)
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Configure rate limiting values
- [ ] Test all CTAs and forms
- [ ] Verify analytics tracking

## License

Private and confidential.

## Support

For issues or questions, please contact the development team.
