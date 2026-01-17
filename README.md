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

- [x] Phase 0: Setup
- [ ] Phase 1: Static UI
- [ ] Phase 2: Database Integration
- [ ] Phase 3: Stripe Checkout
- [ ] Phase 4: Webhooks & Delivery
- [ ] Phase 5: Polish & Deploy

## License

ISC
