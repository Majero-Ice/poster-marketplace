# Digital Posters Marketplace

A marketplace for selling digital art posters built with Next.js, TypeScript, Tailwind CSS, Prisma, Supabase, and Stripe.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Architecture:** Feature-Sliced Design (FSD)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Payments:** Stripe Checkout + Webhooks
- **Storage:** Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Stripe account (test mode)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/poster_marketplace?schema=public"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Supabase (if using Supabase Storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Authentication
JWT_SECRET="your-secret-key-change-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Set up the database:

```bash
npx prisma migrate dev
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

This project follows Feature-Sliced Design (FSD) architecture:

```
src/
├── app/                    # Next.js App Router (pages + API routes)
├── widgets/                # Composite UI blocks (header, footer, grids)
├── features/               # User interactions (purchase, download)
├── entities/               # Business entities (poster, purchase)
└── shared/                 # Reusable infrastructure
    ├── ui/                 # shadcn components
    ├── lib/                # utilities, prisma, stripe
    ├── api/                # fetch helpers
    └── config/             # env, constants
```

## Development Phases

- [X] Phase 0: Setup
- [X] Phase 1: Static UI
- [X] Phase 2: Database Integration
- [X] Phase 3: Stripe Checkout
- [X] Phase 4: Webhooks & Delivery
- [X] Phase 5: Search
- [X] Phase 6: Shopping Cart
- [X] Phase 7: Admin Panel
- [X] Phase 8: Polish & Deploy

## Webhook Setup (Phase 4)

For local development with Stripe webhooks:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login and forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

3. Copy the webhook signing secret and add it to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Complete a test purchase using test card `4242 4242 4242 4242`

For detailed setup instructions, see [docs/PHASE4_SETUP.md](docs/PHASE4_SETUP.md)

## Admin Panel (Phase 7)

Access the admin panel at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default Credentials:**
- Email: `admin@postermart.com`
- Password: `admin123`

**Features:**
- Dashboard with sales statistics
- Product management (CRUD operations)
- Image and file uploads to Supabase Storage
- Order management and tracking
- Secure JWT-based authentication
- Route protection middleware

For detailed documentation, see [docs/PHASE7_ADMIN_PANEL.md](docs/PHASE7_ADMIN_PANEL.md)

## License

ISC
