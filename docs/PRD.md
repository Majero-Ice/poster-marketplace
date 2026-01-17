# Digital Posters Marketplace — PRD

## Project Overview

A marketplace for selling digital art posters (classic paintings, film posters, photography). Users browse a catalog, purchase items via Stripe, and receive download links for high-resolution files.

**Purpose:** Portfolio project demonstrating e-commerce flow with payment integration.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, fullstack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **Architecture:** Feature-Sliced Design (FSD)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Payments:** Stripe Checkout + Webhooks
- **Storage:** Supabase Storage
- **Deployment:** Vercel

## User Stories

1. As a visitor, I can browse a grid of available posters with thumbnails, titles, and prices
2. As a visitor, I can view a single poster's detail page with full description and preview
3. As a buyer, I can click "Buy" and be redirected to Stripe Checkout
4. As a buyer, after successful payment I see a confirmation page
5. As a buyer, I receive a secure download link for the purchased file
6. As a buyer, I cannot access download links without valid purchase verification

## Core Features

### Catalog

- Grid layout with responsive design (mobile/tablet/desktop)
- Poster card: thumbnail, title, artist/category, price
- Hover state with quick preview

### Product Page

- High-quality preview image (watermarked or lower resolution)
- Title, description, dimensions, file format info
- Price and "Buy Now" button

### Checkout Flow

- Stripe Checkout Session creation via API route
- Success page with order confirmation
- Cancel page with return-to-shop option

### File Delivery

- Webhook listener for `checkout.session.completed` event
- Purchase record saved to database with download token
- Secure download page that verifies purchase before serving file
- Files stored in Supabase Storage with signed URLs

## Project Structure (Feature-Sliced Design)

```
src/
├── app/                            # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                    # Home / Catalog
│   ├── posters/
│   │   └── [id]/
│   │       └── page.tsx            # Poster detail
│   ├── checkout/
│   │   ├── success/
│   │   │   └── page.tsx
│   │   └── cancel/
│   │       └── page.tsx
│   ├── download/
│   │   └── [token]/
│   │       └── page.tsx
│   └── api/                        # Backend (API Routes)
│       ├── checkout/
│       │   └── route.ts
│       ├── webhook/
│       │   └── route.ts
│       └── download/
│           └── [token]/
│               └── route.ts
│
├── widgets/                        # Composite UI blocks
│   ├── header/
│   │   ├── ui/
│   │   └── index.ts
│   ├── footer/
│   └── poster-grid/
│
├── features/                       # User interactions
│   ├── purchase-poster/
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   └── download-file/
│
├── entities/                       # Business entities
│   ├── poster/
│   │   ├── ui/                     # PosterCard, PosterPreview
│   │   ├── model/                  # types, schemas
│   │   ├── api/                    # getPosters, getPosterById
│   │   └── index.ts
│   └── purchase/
│
└── shared/
    ├── ui/                         # shadcn components, primitives
    ├── lib/                        # cn(), formatPrice(), stripe, prisma
    ├── api/                        # fetch helpers
    └── config/                     # env, constants
```

## Database Schema (Prisma)

```prisma
model Poster {
  id          String     @id @default(uuid())
  title       String
  description String?
  price       Int        // in cents
  imageUrl    String
  fileUrl     String     // path in Supabase Storage
  category    String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  purchases   Purchase[]
}

model Purchase {
  id              String    @id @default(uuid())
  posterId        String
  poster          Poster    @relation(fields: [posterId], references: [id])
  customerEmail   String
  stripeSessionId String    @unique
  downloadToken   String    @unique
  downloadedAt    DateTime?
  createdAt       DateTime  @default(now())
}
```

## API Routes


| Route                   | Method | Description                           |
| ------------------------- | -------- | --------------------------------------- |
| `/api/checkout`         | POST   | Create Stripe Checkout Session        |
| `/api/webhook`          | POST   | Handle Stripe webhook events          |
| `/api/download/[token]` | GET    | Verify purchase and return signed URL |

## Development Phases

### Phase 0: Setup

- [X] Initialize Next.js with TypeScript
- [X] Configure Tailwind CSS
- [X] Install and setup shadcn/ui
- [X] Setup FSD folder structure
- [X] Setup Prisma with Supabase
- [X] Setup Stripe test account
- [X] Create GitHub repository
- [X] Configure environment variables

### Phase 1: Static UI

- [X] Create layout (Header, Footer)
- [X] Create shared UI components
- [X] Build PosterCard in entities/poster/ui
- [X] Build PosterGrid widget
- [X] Create home page with mock data
- [X] Create poster detail page with mock data

### Phase 2: Database Integration

- [ ] Create Prisma schema
- [ ] Run migrations
- [ ] Seed database with test posters
- [ ] Create poster API functions in entities/poster/api
- [ ] Connect pages to real data

### Phase 3: Stripe Checkout

- [ ] Setup Stripe client in shared/lib
- [ ] Create `/api/checkout` route
- [ ] Build purchase-poster feature (button + logic)
- [ ] Create success page
- [ ] Create cancel page
- [ ] Test checkout flow

### Phase 4: Webhooks & Delivery

- [ ] Create `/api/webhook` route
- [ ] Handle `checkout.session.completed`
- [ ] Save purchase with download token
- [ ] Setup Supabase Storage
- [ ] Create `/api/download/[token]` route
- [ ] Build download-file feature
- [ ] Create download page
- [ ] Test full flow: browse → buy → download

### Phase 5: Polish & Deploy

- [ ] Add loading states (Suspense, skeletons)
- [ ] Add error handling
- [ ] Responsive design fixes
- [ ] SEO metadata
- [ ] Deploy to Vercel
- [ ] Configure production Stripe webhook
- [ ] Test production flow

### Phase 6: Optional

- [ ] Email confirmation (Resend)
- [ ] Search and filters
- [ ] Related posters
- [ ] Admin page for adding products

## Acceptance Criteria

1. User can browse catalog and view individual posters
2. User can complete purchase via Stripe (test mode)
3. After payment, user receives working download link
4. Download link only works with valid purchase token
5. Site is responsive on mobile, tablet, desktop
6. All pages have proper loading and error states
7. Code follows FSD architecture

## Non-Functional Requirements

- Page load < 3 seconds
- Lighthouse score > 80
- Basic accessibility (WCAG)
- Clean, minimal UI

## Content Notes

Use public domain images from:

- Wikimedia Commons
- The Met Open Access
- Rijksmuseum
- Unsplash
