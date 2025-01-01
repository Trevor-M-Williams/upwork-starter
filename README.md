# Next.js Application Template

## Stack

- 🔐 Clerk Auth
- 📊 PostgreSQL + Drizzle ORM
- 🧩 Shadcn/ui

## Getting Started

1. Clone the repository:

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   POSTGRES_URL=your_postgres_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

   *Note: .env.local does not play nicely with drizzle*

4. Initialize the database:
   ```bash
   pnpm db:push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Run Drizzle Studio to view the database while developing
   ```bash
   pnpm db:studio
   ```

## Database

This template uses Drizzle ORM with PostgreSQL. The schema is defined in server/db/schema.ts. Database operations are handled in the server/actions directory.

## Authentication

Authentication is handled by Clerk. Protected routes are configured in the middleware.ts file. The dashboard routes are protected by default and require authentication.

## UI Components

The project uses a combination of custom components and shadcn/ui. Components are styled using Tailwind CSS with a customized theme configuration. The theme can be modified in the tailwind.config.ts file.