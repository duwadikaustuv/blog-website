# 🚀 Free Deployment Guide: ClearMargin Blog

## Option 1: Vercel + Turso (Recommended - True SQLite Compatibility)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Turso account (free at turso.tech)

---

## Step-by-Step Instructions

### 1️⃣ Install Turso CLI

**Windows (PowerShell):**
```powershell
irm https://get.tur.so/install.ps1 | iex
```

Restart your terminal, then verify:
```bash
turso --version
```

### 2️⃣ Create Turso Database

```bash
# Sign up / Login
turso auth signup
turso auth login

# Create database
turso db create clearmargin-blog

# Get database URL
turso db show clearmargin-blog --url

# Create auth token
turso db tokens create clearmargin-blog
```

**Save these values:**
- `DATABASE_URL`: libsql://clearmargin-blog-[yourname].turso.io
- `DATABASE_AUTH_TOKEN`: eyJhbGc...

### 3️⃣ Update Local Configuration

**Install dependencies:**
```bash
npm install @libsql/client @prisma/adapter-libsql
```

**Update `prisma/schema.prisma`:**
Change the datasource from:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db" // Keep for local development
}
```

**Update `lib/prisma.ts`** to support both local and production:
```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient() {
  // Production: Use Turso
  if (process.env.DATABASE_URL?.startsWith('libsql://')) {
    const libsql = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }
  
  // Development: Use local SQLite
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Update `.env.local` with Turso credentials:**
```env
DATABASE_URL="libsql://clearmargin-blog-[yourname].turso.io"
DATABASE_AUTH_TOKEN="eyJhbGc..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### 4️⃣ Push Schema to Turso

```bash
npx prisma db push
npx prisma db seed
```

### 5️⃣ Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and ensure everything works with the cloud database.

### 6️⃣ Prepare for Deployment

**Create `.gitignore` (if not exists):**
```
node_modules/
.next/
.env.local
.env
*.db
*.db-journal
prisma/dev.db
```

**Create `vercel.json`:**
```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 7️⃣ Deploy to Vercel

**Initialize Git repository:**
```bash
git init
git add .
git commit -m "Initial commit"
```

**Push to GitHub:**
1. Create a new repository on GitHub
2. Follow the instructions to push your code:
```bash
git remote add origin https://github.com/yourusername/clearmargin-blog.git
git branch -M main
git push -u origin main
```

**Deploy on Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your Turso database URL
   - `DATABASE_AUTH_TOKEN`: Your Turso auth token
   - `NEXTAUTH_URL`: `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
5. Click "Deploy"

---

## Option 2: Vercel + Vercel Postgres (Easier Setup)

If you prefer not to use Turso, you can use Vercel's built-in Postgres:

### 1️⃣ Update Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

### 2️⃣ Install Postgres Client

```bash
npm install @prisma/client
```

### 3️⃣ Deploy to Vercel

1. Push code to GitHub
2. Import to Vercel
3. In Vercel dashboard, go to your project → Storage → Create Database → Postgres
4. Vercel will automatically add the required environment variables
5. Add `NEXTAUTH_URL` and `NEXTAUTH_SECRET` manually
6. Redeploy

### 4️⃣ Run Migrations

After first deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.production

# Push schema
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

---

## Option 3: Render (All-in-One Free Tier)

### 1️⃣ Switch to PostgreSQL

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2️⃣ Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new PostgreSQL database (free tier)
3. Copy the "Internal Database URL"
4. Create a new Web Service
5. Connect your GitHub repository
6. Add environment variables:
   - `DATABASE_URL`: Your Postgres URL
   - `NEXTAUTH_URL`: Your Render app URL
   - `NEXTAUTH_SECRET`: Generate a secure string
7. Set build command: `npm install && npx prisma generate && npx prisma db push && npm run build`
8. Set start command: `npm start`
9. Deploy

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test article creation (admin)
- [ ] Test article viewing
- [ ] Test dark mode toggle
- [ ] Check mobile responsiveness
- [ ] Seed initial admin account if needed

---

## Troubleshooting

### Build fails on Vercel
- Check environment variables are set correctly
- Ensure `prisma generate` runs before build
- Check build logs for specific errors

### Database connection fails
- Verify DATABASE_URL format
- Check auth token is valid (Turso)
- Ensure database is accessible from the internet

### Authentication issues
- Verify NEXTAUTH_URL matches your deployment URL
- Ensure NEXTAUTH_SECRET is set and is a secure random string
- Check all environment variables are set in Vercel

---

## Cost Comparison

| Provider | Database | Hosting | Total | Limits |
|----------|----------|---------|-------|--------|
| Turso + Vercel | Free | Free | **$0** | 500 DBs, 9GB storage, 1B row reads/month |
| Vercel Postgres + Vercel | Free | Free | **$0** | 256MB storage, 60 compute hours |
| Render | Free | Free | **$0** | 90GB bandwidth, 750 hours/month |

**Recommended: Option 1 (Turso + Vercel)** for true SQLite compatibility and generous free tier.
