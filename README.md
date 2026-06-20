# Inventory Management System — Frontend

Single-page web client for the Inventory Management System, built with **React, TypeScript, Vite, Tailwind CSS & TanStack Query**.

## ✨ Features

- 🔐 JWT auth (login / register) with protected routes & role-aware UI
- 📊 **Dashboard** — KPIs, low-stock alerts, recent activity
- 📦 **Products** — search, filter (category / supplier / low-stock), sort, pagination, create/edit/delete
- 🔁 **Stock movements** — record IN / OUT / ADJUSTMENT from the product list; full history page
- 🗂️ **Categories** & 🏭 **Suppliers** management
- 🔔 Toast notifications, modals, confirm dialogs, responsive layout with sidebar

## 🛠️ Tech Stack

| Concern        | Choice                       |
| -------------- | ---------------------------- |
| Framework      | React 18 + TypeScript        |
| Build tool     | Vite 5                       |
| Styling        | Tailwind CSS 3               |
| Data fetching  | TanStack Query (React Query) |
| HTTP           | Axios                        |
| Routing        | React Router 6               |
| Icons / Toasts | lucide-react / react-hot-toast |

## 🚀 Getting Started (local)

```bash
# 1. Install deps
npm install

# 2. Configure environment
cp .env.example .env
#   -> VITE_API_URL=http://localhost:4000/api  (point at your backend)

# 3. Start the dev server
npm run dev          # http://localhost:5173
```

> Make sure the backend is running (see [`../backend`](../backend)) and seeded.
> Demo login: **admin@ims.dev / admin123**

## 🏗️ Build

```bash
npm run build        # type-check + production build into dist/
npm run preview      # preview the production build
```

## 🐳 Docker

The image builds the static bundle and serves it with **nginx**, which also proxies
`/api` to the backend container. See the root [`docker-compose.yml`](../docker-compose.yml).

```bash
docker build -t ims-frontend --build-arg VITE_API_URL=/api .
```

## 📁 Project Structure

```
src/
├── api/          # typed API service functions (axios)
├── components/   # Layout, ProtectedRoute, ui/ primitives, forms/
├── context/      # AuthContext
├── lib/          # axios instance, formatters
├── pages/        # Login, Register, Dashboard, Products, Categories, Suppliers, StockMovements
├── types/        # shared TypeScript types
├── App.tsx       # routes
└── main.tsx      # entry (providers)
```
