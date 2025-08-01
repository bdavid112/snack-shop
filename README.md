# 🥨 Snack Shop

A full-stack web application for managing and ordering snacks. Built with **Fastify**, **PostgreSQL**, **Prisma**, and **Docker**, with a modern frontend interface.

## 🧱 Tech Stack

- **Backend**: Fastify (Node.js), Prisma ORM
- **Database**: PostgreSQL (Docker)
- **Frontend**: React, Vite, Tailwind CSS v3, Axios, TypeScript
- **Dev Tools**: Docker, Prisma Studio, VS Code

---

## 🛠 Tooling

- **Linting**: ESLint (with TypeScript support)
- **Formatting**: Prettier
- **ORM**: Prisma
- **Containerization**: Docker
- **Dev Environment**: VS Code with recommended extensions

---

## 📁 Project Structure

```
snack-shop/
├── server/                 # Fastify backend
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── routes/         # Fastify route handlers
│   │   ├── plugins/        # DB connection and utilities
│   │   └── server.ts       # App entry point
│   └── Dockerfile
├── client/                 # Frontend application
│   ├── src/                # React components and logic
│   ├── public/             # Static files
│   └── vite.config.ts      # Vite configuration
├── .env                    # Environment variables
├── docker-compose.yml
└── README.md
```

---

## 🐳 Running with Docker

Make sure Docker is installed and running.

```bash
# Start the app (API + PostgreSQL)
docker-compose up --build
```

This will:

- Start the Fastify API on `http://localhost:3000`
- Spin up a PostgreSQL DB on port `5432`
- Automatically run Prisma migrations

To stop:

```bash
docker-compose down
```

---

## 🌐 API Endpoints

All endpoints use JSON and are prefixed under `/api`.

### 🧑 Auth

- `POST /api/register`
  Register a new user (username, password)

- `POST /api/login`
  Log in (username, password)
  **Returns:** `{ authenticated: true|false, isAdmin: true|false }`

### 🍿 Products

- `GET /api/products`
  List all snack products (public)

- `POST /api/products`
  Add a new product (admin only)

- `PUT /api/products/:id`
  Edit a product (admin only)

- `DELETE /api/products/:id`
  Delete a product (admin only)

### 🛒 Orders

- `POST /api/order`
  Submit an order (user, cart items)
  - Checks stock, decreases inventory, saves order

- `GET /api/orders`
  List all orders (admin only)

---

## 🧪 Environment Variables

Create a `.env` file in `/server`:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/snackshop
```

---

## 🿳 Prisma

Useful commands:

```bash
# Apply schema changes to DB
npx prisma migrate dev

# Deploy migrations (e.g. in production)
npx prisma migrate deploy

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 🧪 Development

To start the entire stack using Docker:

```bash
docker-compose up --build
```

Or to run the backend only (assuming PostgreSQL is running locally):

```bash
cd server
npx prisma generate
npm run dev
```

---

## 🖼️ Frontend

The frontend application is located in the `/client` directory. It is built with **React**, **Vite**, **Tailwind CSS v3**, **TypeScript**, and **Axios** for HTTP requests.

To start the frontend development server:

```bash
cd client
npm install
npm run dev
```

Linting and formatting are enforced using ESLint and Prettier.
