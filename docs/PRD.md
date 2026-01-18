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

### Visitor
1. As a visitor, I can browse a grid of available posters with thumbnails, titles, and prices
2. As a visitor, I can search posters by title or category
3. As a visitor, I can view a single poster's detail page with full description and preview
4. As a visitor, I can add posters to my cart
5. As a visitor, I can view my cart and see total price
6. As a visitor, I can remove items from my cart
7. As a visitor, I can adjust quantity in cart

### Buyer
8. As a buyer, I can checkout all cart items at once via Stripe
9. As a buyer, after successful payment I see a confirmation page
10. As a buyer, I receive secure download links for all purchased files

### Admin
11. As an admin, I can log in to admin panel
12. As an admin, I can add new posters with images and files
13. As an admin, I can edit existing poster information
14. As an admin, I can delete posters
15. As an admin, I can view all purchases

## Core Features

### Catalog
- Grid layout with responsive design (mobile/tablet/desktop)
- Poster card: thumbnail, title, artist/category, price
- Hover state with quick preview
- Search bar with real-time filtering
- "Add to Cart" button on each card

### Product Page
- High-quality preview image (watermarked or lower resolution)
- Title, description, dimensions, file format info
- Price and "Add to Cart" button
- Quantity selector

### Cart
- List of added items with thumbnails
- Quantity adjustment per item
- Remove item button
- Subtotal per item
- Total price
- "Proceed to Checkout" button
- Persistent cart (localStorage or database)

### Checkout Flow
- Stripe Checkout Session with multiple line items
- Success page with order confirmation and download links
- Cancel page with return-to-cart option

### File Delivery
- Webhook listener for `checkout.session.completed` event
- Purchase records saved for each item with download tokens
- Secure download page that verifies purchase
- Files stored in Supabase Storage with signed URLs

### Admin Panel
- Protected route (password or Supabase Auth)
- Dashboard with stats (total products, total sales)
- Product list with edit/delete actions
- Add new product form (title, description, price, category, images, files)
- Edit product form
- Delete confirmation modal
- Purchases/orders list

### Search
- Search input on main page
- Search by title, description, category
- Debounced input (300ms)
- Clear search button
- "No results" state

## Project Structure (Feature-Sliced Design)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home / Catalog with search
│   ├── posters/
│   │   └── [id]/
│   │       └── page.tsx            # Poster detail
│   ├── cart/
│   │   └── page.tsx                # Cart page
│   ├── checkout/
│   │   ├── success/
│   │   │   └── page.tsx
│   │   └── cancel/
│   │       └── page.tsx
│   ├── download/
│   │   └── [token]/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx            # Product list
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Add product
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit product
│   │   └── orders/
│   │       └── page.tsx            # Orders list
│   └── api/
│       ├── checkout/
│       │   └── route.ts
│       ├── webhook/
│       │   └── route.ts
│       ├── download/
│       │   └── [token]/
│       │       └── route.ts
│       ├── posters/
│       │   ├── route.ts            # GET all, POST new
│       │   ├── search/
│       │   │   └── route.ts        # GET search
│       │   └── [id]/
│       │       └── route.ts        # GET one, PUT, DELETE
│       └── admin/
│           └── auth/
│               └── route.ts
│
├── widgets/
│   ├── header/
│   ├── footer/
│   ├── poster-grid/
│   ├── search-bar/
│   ├── cart-sidebar/               # Optional: slide-out cart
│   └── admin-sidebar/
│
├── features/
│   ├── purchase-poster/
│   ├── download-file/
│   ├── add-to-cart/
│   │   ├── ui/
│   │   ├── model/
│   │   └── index.ts
│   ├── cart-management/
│   │   ├── ui/                     # CartItem, CartList
│   │   ├── model/                  # cart store (zustand)
│   │   └── index.ts
│   ├── search-posters/
│   │   ├── ui/
│   │   ├── model/
│   │   └── index.ts
│   └── admin/
│       ├── product-form/
│       ├── product-list/
│       └── order-list/
│
├── entities/
│   ├── poster/
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   ├── purchase/
│   └── cart-item/
│       ├── ui/
│       ├── model/
│       └── index.ts
│
└── shared/
    ├── ui/
    ├── lib/
    ├── api/
    └── config/
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
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  purchases   Purchase[]
}

model Purchase {
  id              String    @id @default(uuid())
  posterId        String
  poster          Poster    @relation(fields: [posterId], references: [id])
  customerEmail   String
  stripeSessionId String
  downloadToken   String    @unique
  quantity        Int       @default(1)
  priceAtPurchase Int       // price at time of purchase
  downloadedAt    DateTime?
  createdAt       DateTime  @default(now())

  @@index([stripeSessionId])
}

model Admin {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/posters` | GET | Get all posters |
| `/api/posters` | POST | Create new poster (admin) |
| `/api/posters/search` | GET | Search posters by query |
| `/api/posters/[id]` | GET | Get single poster |
| `/api/posters/[id]` | PUT | Update poster (admin) |
| `/api/posters/[id]` | DELETE | Delete poster (admin) |
| `/api/checkout` | POST | Create Stripe Checkout Session (multiple items) |
| `/api/webhook` | POST | Handle Stripe webhook events |
| `/api/download/[token]` | GET | Verify purchase and return signed URL |
| `/api/admin/auth` | POST | Admin login |

## Development Phases

### Phase 0: Setup
- [x] Initialize Next.js with TypeScript
- [x] Configure Tailwind CSS
- [x] Install and setup shadcn/ui
- [x] Setup FSD folder structure
- [x] Setup Prisma with Supabase
- [x] Setup Stripe test account
- [x] Create GitHub repository
- [x] Configure environment variables

### Phase 1: Static UI
- [x] Create layout (Header, Footer)
- [x] Create shared UI components
- [x] Build PosterCard in entities/poster/ui
- [x] Build PosterGrid widget
- [x] Create home page with mock data
- [x] Create poster detail page with mock data

### Phase 2: Database Integration
- [x] Create Prisma schema
- [x] Run migrations
- [x] Seed database with test posters
- [x] Create poster API functions in entities/poster/api
- [x] Connect pages to real data

### Phase 3: Stripe Checkout
- [x] Setup Stripe client in shared/lib
- [x] Create `/api/checkout` route
- [x] Build purchase-poster feature (button + logic)
- [x] Create success page
- [x] Create cancel page
- [x] Test checkout flow

### Phase 4: Webhooks & Delivery
- [x] Create `/api/webhook` route
- [x] Handle `checkout.session.completed`
- [x] Save purchase with download token
- [x] Setup Supabase Storage
- [x] Create `/api/download/[token]` route
- [x] Build download-file feature
- [x] Create download page
- [x] Test full flow: browse → buy → download

### Phase 5: Search
- [x] Create search-posters feature
- [x] Build SearchBar widget
- [x] Create `/api/posters/search` route
- [x] Add search to home page
- [x] Implement debounced search input
- [x] Add "No results" state
- [x] Add clear search button

### Phase 6: Shopping Cart
- [x] Create cart-item entity
- [x] Create cart-management feature with Zustand store
- [x] Implement cart persistence (localStorage)
- [x] Build AddToCartButton component
- [x] Build CartItem component (thumbnail, title, price, quantity, remove)
- [x] Build CartList component
- [x] Create cart page with total calculation
- [x] Add quantity adjustment (+/- buttons)
- [x] Add remove item functionality
- [x] Update checkout to handle multiple items
- [x] Update webhook to create multiple purchase records
- [x] Update success page to show all download links
- [x] Add cart icon with item count to header

### Phase 7: Admin Panel
- [x] Add Admin model to Prisma schema
- [x] Create admin seed (default admin user)
- [x] Create admin login page
- [x] Implement admin authentication (JWT or session)
- [x] Create admin layout with sidebar
- [x] Build admin dashboard (stats overview)
- [x] Create product list page with table
- [x] Build ProductForm component (reusable for add/edit)
- [x] Create add product page
- [x] Implement image upload to Supabase Storage
- [x] Implement file upload for downloadable content
- [x] Create edit product page
- [x] Implement delete product with confirmation
- [x] Create orders list page
- [x] Add admin route protection (middleware)

### Phase 8: Polish & Deploy
- [x] Add loading states (Suspense, skeletons)
- [x] Add error handling
- [x] Responsive design fixes
- [x] SEO metadata
- [x] Deploy to Vercel (documentation prepared)
- [x] Configure production Stripe webhook (documentation prepared)
- [x] Test production flow (ready for testing after deployment)

## Acceptance Criteria

1. User can browse catalog and view individual posters
2. User can search posters by title/description
3. User can add multiple posters to cart
4. User can adjust quantities and remove items from cart
5. User can checkout all cart items at once
6. After payment, user receives download links for all items
7. Download links only work with valid purchase tokens
8. Admin can add, edit, and delete products
9. Admin can view all orders
10. Site is responsive on mobile, tablet, desktop
11. All pages have proper loading and error states
12. Code follows FSD architecture

## Non-Functional Requirements

- Page load < 3 seconds
- Lighthouse score > 80
- Basic accessibility (WCAG)
- Clean, minimal UI
- Secure admin area

## Content Notes

Use public domain images from:
- Wikimedia Commons
- The Met Open Access
- Rijksmuseum
- Unsplash
