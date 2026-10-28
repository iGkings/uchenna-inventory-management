# Uchenna Inventory Management System — iGkings Innovation

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-06274B.svg)](#)
[![Company](https://img.shields.io/badge/Company-iGkings%20Innovation-FF941F.svg)](#)
[![Owner](https://img.shields.io/badge/Lead%20Engineer-Uchenna-159A63.svg)](#)

A commercial-grade, responsive full-stack inventory management application developed for the software development capstone presentation.

The system incorporates the official **iGkings Innovation** brand identity with an enterprise layout inspired by modern SaaS operations dashboards.

---

## 🌟 Key Features

- **Branded Design System:** Centered around iGkings Innovation navy blue (`#06274B`), orange (`#FF941F`), and emerald green (`#159A63`) design tokens.
- **Role-Based Authentication:** Bcrypt password encryption, signed JWTs in HTTP-only cookies, and persistent session verification.
- **Demonstration Access:** One-click prefill demo credential tool on the login interface.
- **Live Inventory Analytics Dashboard:** Real-time database metrics, inventory value calculation, interactive Recharts Stock In/Stock Out monthly graph, recent movements table, and warehouse capacity cards.
- **Product Management:** Complete CRUD with SKU uniqueness enforcement, category classification, search, multi-factor filtering, column sorting, pagination, and CSV export.
- **Transaction-Safe Stock Adjustments:** Atomic updates executing stock changes (`IN`, `OUT`, `ADJUSTMENT`), balance validations, immutable movement history, and audit logging inside database transactions.
- **Category Hierarchy:** Full CRUD with product assignment counting, inventory valuation, and safe deletion checks preventing orphaned products.
- **Comprehensive Test Suite:** Vitest and React Testing Library covering backend API endpoints and frontend React components.

---

## 🔑 Demo Access Credentials

The database is pre-seeded with an administrator demonstration account:

| Field | Value |
| :--- | :--- |
| **Email** | `demo@igkings.com` |
| **Password** | `Demo@12345` |
| **Name** | Uchenna |
| **Role** | Administrator |

*(A quick "One-Click Autofill Demo Account" button is provided directly on the Login page for convenience during evaluation).*

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, React Router v7, Plain CSS with Token Variables, Recharts, Lucide React.
- **Backend:** Node.js, Express.js REST API, CORS, Cookie-Parser, Helmet, Express-Rate-Limit, Morgan.
- **Database & ORM:** PostgreSQL with Prisma ORM 5.
- **Testing:** Vitest, React Testing Library, Supertest, JSDOM.

---

## 📂 Project Directory Structure

```text
uchenna-inventory-management/
├── client/                     # Vite + React Frontend
│   ├── public/
│   │   └── images/
│   │       └── igkings-logo.png # Official iGkings Innovation Logo
│   ├── src/
│   │   ├── components/         # Reusable UI Components (StatCard, DataTable, Modal, etc.)
│   │   ├── features/           # Feature Modules (auth, products, categories, dashboard)
│   │   ├── layouts/            # AppLayout Shell & Navigation
│   │   ├── pages/              # Login, Dashboard, Products, Categories
│   │   ├── services/           # API Service Client Layer
│   │   ├── styles/             # tokens.css, reset.css, global.css, responsive.css
│   │   ├── utils/              # formatters, validators, constants, exportCsv
│   │   ├── App.jsx             # React Router Configuration
│   │   └── main.jsx            # Application Entry Point
├── server/                     # Express.js REST API Backend
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL Database Models
│   │   ├── schema.sqlite.prisma# Local Zero-Setup SQLite Schema
│   │   ├── migrations/         # PostgreSQL Migration SQL
│   │   └── seed.js             # Idempotent Database Seed Script
│   ├── src/
│   │   ├── controllers/        # Express Route Handlers
│   │   ├── middleware/         # Auth, Rate Limiting, Error Handling
│   │   ├── routes/             # REST Endpoints
│   │   ├── services/           # Database Transactions & Business Logic
│   │   ├── validators/         # Input Sanitation & Schema Rules
│   │   ├── utils/              # Prisma Client Singleton, Response Helpers
│   │   ├── app.js              # Express App Configuration
│   │   └── server.js           # Server Startup & Graceful Shutdown
│   └── tests/                  # Vitest API Integration Tests
├── scripts/
│   └── dev.js                  # Cross-Platform Concurrent Runner
├── design.md                   # Architectural Design Specifications
├── README.md                   # Setup & Deployment Guide
├── .gitignore                  # Git Ignore Rules
└── package.json                # Root Orchestration Scripts
```

---

## 🚀 Local Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended; verified on Node v24)
- [npm](https://www.npmjs.com/) (v9 or higher)

### 2. Installation

Clone the repository and install all dependencies:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/uchenna-inventory-management.git
cd uchenna-inventory-management

# Install dependencies for client and server
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 3. Database Initialization & Seeding

The database includes an idempotent seed script with categories, products, movement history, and the demo user.

```bash
# Seed the database
npm run seed
```

### 4. Running the Application Locally

To start both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 5. Running Automated Tests

```bash
# Run all tests (both client and server)
npm test

# Run frontend tests only
npm run test:client

# Run backend API tests only
npm run test:server
```

---

## 🌐 Render Cloud Deployment Guide

This project is pre-configured for deployment on **Render** (as a unified full-stack web service or separate frontend/backend services).

### Option A: Unified Full-Stack Service on Render (Recommended)

1. **Create a PostgreSQL Database on Render:**
   - Log into [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** > **PostgreSQL**.
   - Name: `uchenna-inventory-db`.
   - Choose the Free tier and click **Create Database**.
   - Copy the **Internal Database URL** (or **External Database URL**).

2. **Create a Web Service on Render:**
   - Click **New +** > **Web Service**.
   - Connect your GitHub repository: `uchenna-inventory-management`.
   - Runtime: `Node`.
   - **Build Command:**
     ```bash
     npm install --prefix client && npm run build --prefix client && npm install --prefix server && npx --prefix server prisma generate && npx --prefix server prisma migrate deploy && node server/prisma/seed.js
     ```
   - **Start Command:**
     ```bash
     npm start
     ```

3. **Configure Environment Variables in Render:**
   Under **Environment Variables**, add:

   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `DATABASE_URL` | *Paste your Render PostgreSQL Database URL* |
   | `JWT_SECRET` | *Generate a strong 64-character secret* |
   | `JWT_EXPIRES_IN`| `7d` |
   | `COOKIE_SECRET`| *Generate a random cookie secret* |
   | `CLIENT_URL` | *Your Render Service URL (e.g., https://uchenna-inventory.onrender.com)* |

4. Click **Deploy Web Service**. Express automatically serves the built React SPA from `client/dist` and handles API requests at `/api/*`.

---

## 📡 API Reference Overview

All endpoints are prefixed with `/api`. Authenticated endpoints require an active session cookie or `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/auth/login` — Sign in with email and password.
- `POST /api/auth/logout` — Terminate session and clear cookie.
- `GET /api/auth/me` — Retrieve active authenticated user profile.

### Dashboard Analytics
- `GET /api/dashboard/stats` — Aggregate metrics, movement chart data, warehouse overview, and low-stock items.

### Products
- `GET /api/products` — List products with search (`q`), category (`categoryId`), status (`status`), sorting (`sortBy`, `sortOrder`), and pagination.
- `GET /api/products/:id` — Get detailed product specifications with recent movement history.
- `POST /api/products` — Create a new product (validates SKU uniqueness, non-negative price).
- `PUT /api/products/:id` — Update existing product details.
- `DELETE /api/products/:id` — Remove product.
- `POST /api/products/:id/adjust` — Atomic stock adjustment (`IN`, `OUT`, `ADJUSTMENT`) with transaction-safe balance verification.
- `GET /api/products/export/csv` — Stream inventory catalog as downloadable CSV.

### Categories
- `GET /api/categories` — List categories with associated product count and valuation.
- `GET /api/categories/:id` — Get category details and assigned products.
- `POST /api/categories` — Create category (validates unique name).
- `PUT /api/categories/:id` — Update category name/description.
- `DELETE /api/categories/:id` — Safe deletion check (blocks deletion if products are assigned).

---

## 👨‍💻 Capstone Presentation Checklist

- [x] Official iGkings Innovation logo rendered cleanly with preserved proportions
- [x] Navy blue (`#06274B`), orange (`#FF941F`), and emerald green (`#159A63`) design system
- [x] 4 responsive pages implemented: Login, Dashboard, Products, Categories
- [x] Interactive stock movement bar chart matching reference screenshot
- [x] Real PostgreSQL Prisma database persistence
- [x] Stock status calculations: Out of Stock (=0), Low Stock (<= reorder level), In Stock (> reorder level)
- [x] Atomic transactions for inventory balance adjustments and audit logging
- [x] CSV export of product inventory
- [x] 100% automated test pass rate (13 unit and integration test cases)
- [x] Production build validated with Vite
- [x] Clear deployment steps for Render cloud hosting
