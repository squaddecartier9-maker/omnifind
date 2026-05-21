# OmniFind — Universal Marketplace Platform

> One search. Every store. The best price, instantly.

## What this is

OmniFind is a multi-store marketplace platform where any seller can open a store, and any buyer can search across all stores simultaneously to find the best price. Think Shopify meets Google Shopping — but cheaper, simpler, and built for growth.

## Project structure

```
omnifind/
├── frontend/          # Next.js 14 app (App Router)
│   ├── app/           # Pages and layouts
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities, API clients
│   └── ...
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── models/    # Database models
│   │   ├── services/  # Business logic
│   │   └── middleware/
│   └── ...
└── README.md
```

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG, SEO, fast |
| Styling | Tailwind CSS | Utility-first, rapid dev |
| Backend | Node.js + Express | Simple, scalable |
| Database | PostgreSQL | Relational, reliable |
| Cache + Search | Redis + Meilisearch | Sub-300ms search |
| Auth | Clerk | Drop-in auth, social login |
| Payments | Stripe | Global, trusted |
| Storage | Cloudflare R2 | Cheap image storage |
| Deploy (FE) | Vercel | Free tier, instant deploys |
| Deploy (BE) | Railway | $5/mo to start |

## Quick start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### 1. Clone and install

```bash
git clone https://github.com/you/omnifind.git
cd omnifind

# Install frontend deps
cd frontend && npm install

# Install backend deps  
cd ../backend && npm install
```

### 2. Set up environment variables

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

Fill in the values (see Environment Variables section below).

### 3. Set up the database

```bash
cd backend
npm run db:migrate      # Run migrations
npm run db:seed         # Seed demo data
```

### 4. Start development

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:4000

---

## Environment variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
NEXT_PUBLIC_MEILISEARCH_KEY=masterKey
```

### Backend (`backend/.env`)

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/omnifind
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=masterKey
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=omnifind-images
JWT_SECRET=your-super-secret-key-change-this
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in vercel.com
3. Add environment variables
4. Deploy — done

### Backend → Railway
1. railway.app → New Project → Deploy from GitHub
2. Add PostgreSQL and Redis plugins
3. Set environment variables
4. Deploy

### Search → Meilisearch Cloud
- meilisearch.com → free tier available
- Or self-host on Railway alongside the backend

---

## Pricing model

| Plan | Price | Stores | Products | Fees |
|---|---|---|---|---|
| Starter | €0/mo | 1 | 100 | 0% |
| Growth | €19/mo | 5 | Unlimited | 0% |
| Enterprise | €59/mo | Unlimited | Unlimited | 0% |

OmniFind charges sellers a monthly subscription, never a transaction fee. This is the core competitive advantage vs Shopify (up to 2% per sale).

---

## Roadmap

- [x] Multi-store seller dashboard
- [x] Universal search across all stores
- [x] Product comparison (same item, multiple stores)
- [x] Stripe checkout
- [ ] Mobile app (React Native)
- [ ] Seller analytics v2
- [ ] AI-powered recommendations
- [ ] B2B / wholesale mode
