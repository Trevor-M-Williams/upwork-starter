# Next.js Template: Clerk + Vercel Postgres + Drizzle ORM + Shadcn UI

This is a [Next.js](https://nextjs.org/docs) template that includes authentication with [Clerk](https://clerk.com/docs/references/nextjs/overview), a [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) database, [Drizzle ORM](https://orm.drizzle.team/docs/overview), and a basic dashboard built with [Shadcn UI](https://ui.shadcn.com/docs).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

Create a new [Clerk](https://dashboard.clerk.com) application and a new [Vercel Postgres](https://vercel.com) instance and add the credentials to the `.env` file.

Once your database is created, run the following command to push the initial schema to it:

```bash
pnpm db:push
```

For interacting with the database during development, you can use the following command to start Drizzle studio:

```bash
pnpm db:studio
```

To start the dev server run:

```bash
pnpm dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
