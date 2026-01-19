# 🖼️ PosterMart — Digital Posters Marketplace

A modern e-commerce platform for selling digital art posters. Users can browse, search, add to cart, and purchase high-resolution artwork with instant digital delivery.

<p align="center">
  <a href="#demo">View Demo</a> •
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a>
</p>

<!-- TODO: Replace with your deployed URL -->
<p align="center">
  <a href="https://poster-marketplace.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

## Demo

<!-- TODO: Replace with actual GIF (15-30 sec, showing: browse → add to cart → checkout) -->
<p align="center">
  <img src="docs/assets/demo.gif" alt="PosterMart Demo" width="800" />
</p>

<!-- TODO: Optional - Link to full video demo -->
<!-- 
<p align="center">
  <a href="https://youtube.com/your-video">▶️ Watch full demo (2 min)</a>
</p>
-->

---

## Features

### 🛍️ Customer Experience
- **Product Catalog** — Browse posters in a responsive grid layout
- **Search** — Find posters by title, description, or category
- **Shopping Cart** — Add items, adjust quantities, persistent across sessions
- **Secure Checkout** — Stripe integration with test/live mode support
- **Instant Delivery** — Download links generated immediately after purchase

### 🔐 Admin Panel
- **Dashboard** — Sales statistics and overview
- **Product Management** — Add, edit, delete posters
- **File Uploads** — Image and downloadable file storage via Supabase
- **Order Tracking** — View all purchases and customer details

---

## Screenshots

<!-- TODO: Add actual screenshots (recommended: 4-6 images) -->

<details>
<summary>📸 Click to view screenshots</summary>

### Homepage & Catalog
<<<<<<< HEAD
<img src="docs/assets/screenshots/homepage.jpg" alt="Homepage" width="800" />


### Product Page
<img src="docs/assets/screenshots/product.jpg" alt="Product Page" width="800" />

### Shopping Cart
<img src="docs/assets/screenshots/cart.png" alt="Shopping Cart" width="800" />

### Checkout (Stripe)
<img src="docs/assets/screenshots/checkout.png" alt="Stripe Checkout" width="800" />

### Admin Dashboard
<img src="docs/assets/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="800" />

### Admin — Product Management
<img src="docs/assets/screenshots/admin-products.png" alt="Admin Products" width="800" />
=======
<!-- <img src="docs/assets/screenshots/homepage.png" alt="Homepage" width="800" /> -->
`docs/assets/screenshots/homepage.png`

### Product Page
<!-- <img src="docs/assets/screenshots/product.png" alt="Product Page" width="800" /> -->
`docs/assets/screenshots/product.png`

### Shopping Cart
<!-- <img src="docs/assets/screenshots/cart.png" alt="Shopping Cart" width="800" /> -->
`docs/assets/screenshots/cart.png`

### Checkout (Stripe)
<!-- <img src="docs/assets/screenshots/checkout.png" alt="Stripe Checkout" width="800" /> -->
`docs/assets/screenshots/checkout.png`

### Admin Dashboard
<!-- <img src="docs/assets/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="800" /> -->
`docs/assets/screenshots/admin-dashboard.png`

### Admin — Product Management
<!-- <img src="docs/assets/screenshots/admin-products.png" alt="Admin Products" width="800" /> -->
`docs/assets/screenshots/admin-products.png`
>>>>>>> 805c0f73c562d728ca4e33cda1aa4467ed0f459a

</details>

---

## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</p>

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Architecture | Feature-Sliced Design (FSD) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Payments | Stripe Checkout + Webhooks |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Project Architecture

This project follows **Feature-Sliced Design (FSD)** methodology for scalable frontend architecture:

```
src/
├── app/          # Next.js App Router (pages + API routes)
├── widgets/      # Composite UI blocks (header, footer, grids)
├── features/     # User interactions (cart, search, checkout)
├── entities/     # Business entities (poster, purchase)
└── shared/       # Reusable code (ui, lib, api, config)
```

---

# 🛠️ Technical Documentation

<details>
<summary><strong>Click to expand setup instructions</strong></summary>

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Stripe account (test mode)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/poster-marketplace.git
cd poster-marketplace
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/poster_marketplace?schema=public"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Authentication
JWT_SECRET="your-secret-key-change-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up the database:

```bash
npx prisma migrate dev
npx prisma generate
```

5. Seed the database (optional):

```bash
npx prisma db seed
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Stripe Webhook Setup

For local development:

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)

2. Forward webhooks to localhost:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

3. Copy the webhook signing secret to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Test with card number: `4242 4242 4242 4242`

---

## Admin Panel

Access: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default Credentials:**
- Email: `admin@postermart.com`
- Password: `admin123`

**Capabilities:**
- Dashboard with sales statistics
- Product CRUD operations
- Image/file uploads to Supabase Storage
- Order management
- JWT-based authentication
- Route protection middleware

---

## Development Phases

- [x] Phase 0: Project Setup
- [x] Phase 1: Static UI
- [x] Phase 2: Database Integration
- [x] Phase 3: Stripe Checkout
- [x] Phase 4: Webhooks & Delivery
- [x] Phase 5: Search
- [x] Phase 6: Shopping Cart
- [x] Phase 7: Admin Panel
- [x] Phase 8: Polish & Deploy

</details>

---

## License

ISC

---

<p align="center">
  Built with ☕ by <a href="https://github.com/Majero-Ice">Majero</a>
</p>
