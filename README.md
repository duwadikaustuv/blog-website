# Blog Website

A modern, full-stack blog platform built with Next.js 15, TypeScript, Prisma, and NextAuth.js. Features a complete authentication system with role-based access control (user, admin, superadmin) and a rich content management interface.

## Features

### Authentication & Authorization
- Email/Password authentication with NextAuth.js v5
- Role-based access control (User, Admin, Superadmin)
- Protected routes and API endpoints
- Session management with JWT

### Content Management
- Rich text editor for article creation and editing
- Article drafts and publishing workflow
- Slug-based article routing
- Cover image support with remote pattern configuration
- Tag system for content organization

### Admin Panel
- Dashboard with statistics overview
- User management (Superadmin only)
- Article management (create, edit, delete)
- Role assignment and user deletion (Superadmin only)

### UI/UX
- Responsive design with Tailwind CSS v4
- Dark/light theme toggle
- Professional typography and layouts
- Optimized for all device sizes

## Tech Stack

### Frontend
- Next.js 15.1.0 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- React Icons 5.3.0
- React Quill (Rich Text Editor)

### Backend
- Next.js API Routes
- Prisma ORM 5.22.0
- NextAuth.js v5.0.0-beta.25
- Bcryptjs for password hashing
- Zod for validation

### Database
- SQLite (local development)
- Turso/LibSQL (production)
- Prisma adapter for LibSQL

## Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Local Development Database (SQLite)
DATABASE_URL="file:./auth"
TURSO_AUTH_TOKEN=""

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. Initialize the database:
```bash
npm run db:push
```

5. Seed the database with initial data:
```bash
npm run db:seed
```

This creates:
- Superadmin user: `superadmin@example.com` / `superadmin123`
- Admin user: `admin@example.com` / `admin123`
- Sample article

6. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
blog-website/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/         # Protected user routes
│   │   └── dashboard/
│   ├── admin/               # Admin panel
│   │   ├── articles/
│   │   └── users/
│   ├── api/                 # API routes
│   │   ├── admin/
│   │   ├── articles/
│   │   ├── auth/
│   │   └── register/
│   ├── blog/                # Public blog pages
│   │   └── [slug]/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── admin/               # Admin components
│   │   ├── ArticleForm.tsx
│   │   ├── DeleteArticleButton.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── UserActions.tsx
│   ├── auth/                # Auth components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── blog/                # Blog components
│   │   └── BlogCard.tsx
│   └── layout/              # Layout components
│       ├── Footer.tsx
│       ├── Header.tsx
│       └── ThemeToggle.tsx
├── lib/
│   ├── actions.ts           # Server actions
│   ├── auth.ts              # NextAuth configuration
│   ├── authHelpers.ts       # Authorization utilities
│   ├── db.ts                # Database utilities
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
└── types/
    └── index.ts             # TypeScript type definitions
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

## User Roles

### User (Default)
- Register and login
- View published articles
- Access personal dashboard

### Admin
- All User permissions
- Create, edit, and delete articles
- Publish/unpublish articles
- Access admin panel

### Superadmin
- All Admin permissions
- Manage users (view, promote, demote, delete)
- Assign roles (user, admin, superadmin)
- Full system access

## Database Schema

### User
- Authentication credentials
- Profile information
- Role assignment
- Account and session relations

### Article
- Title, slug, content
- Excerpt and cover image
- Published status
- Author relation
- Timestamps

### Account, Session, VerificationToken
- NextAuth.js authentication tables

## Deployment

### Production Database Setup

1. Create a Turso database at [turso.tech](https://turso.tech)

2. Get your database URL and auth token from the Turso dashboard

3. Create tables in Turso SQL Console:

```sql
-- Create User table
CREATE TABLE User (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    image TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    emailVerified DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create Account table
CREATE TABLE Account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE(provider, providerAccountId)
);

-- Create Session table
CREATE TABLE Session (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Create VerificationToken table
CREATE TABLE VerificationToken (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Create Article table
CREATE TABLE Article (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    coverImage TEXT,
    published INTEGER DEFAULT 0 NOT NULL,
    readTime TEXT DEFAULT '5 min read' NOT NULL,
    tags TEXT DEFAULT '[]' NOT NULL,
    authorId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_account_userId ON Account(userId);
CREATE INDEX idx_session_userId ON Session(userId);
CREATE INDEX idx_article_authorId ON Article(authorId);
CREATE INDEX idx_article_slug ON Article(slug);
CREATE INDEX idx_article_published ON Article(published);
```

4. Insert initial superadmin user:

```sql
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
    'clz123superadmin',
    'Super Admin',
    'superadmin@example.com',
    '$2a$10$vG3Q5sL.PqH1K4xNzL9zLeY5KxJ3FQPQhZpQJ8qXm5hJ9KxNzL9zL',
    'superadmin',
    datetime('now'),
    datetime('now')
);
```

Note: The password hash above is for `admin123`

### Deploy to Vercel

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/blog-website.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "New Project" and import your repository

4. Add environment variables before deploying:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `libsql://your-database.turso.io` |
| `TURSO_AUTH_TOKEN` | Your Turso auth token |
| `NEXTAUTH_SECRET` | Your secret key (same as local) |
| `NEXTAUTH_URL` | Leave empty initially |

5. Click "Deploy"

6. After deployment, update `NEXTAUTH_URL`:
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Go to Settings → Environment Variables
   - Edit `NEXTAUTH_URL` and set it to your Vercel URL
   - Redeploy from Deployments tab

7. Visit your deployed site and login with `superadmin@example.com` / `admin123`

## Environment Variables

### Local Development (.env.local)
```env
DATABASE_URL="file:./auth"
TURSO_AUTH_TOKEN=""
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```env
DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"
```

## Security

- Passwords hashed with bcryptjs (12 rounds)
- Protected routes with NextAuth.js middleware
- Role-based API endpoint protection
- Environment variables for sensitive data
- CSRF protection via NextAuth.js
- Secure session management with JWT
- SQL injection prevention via Prisma ORM

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

### Database
- Local development uses SQLite for simplicity
- Production uses Turso (LibSQL) for scalability
- Prisma schema is compatible with both
- Driver adapters handle the connection differences

### Authentication
- NextAuth.js v5 (beta) is used for modern app router support
- JWT strategy for session management
- Email/password credentials provider
- Ready for OAuth providers integration

### Styling
- Tailwind CSS v4 with PostCSS plugin
- Dark mode with system preference detection
- Responsive design mobile-first approach
- Custom color scheme in globals.css

## Troubleshooting

### Login issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Database connection errors
- For local: Ensure `DATABASE_URL="file:./auth"` in `.env.local`
- For production: Verify Turso credentials are correct
- Check that tables are created in Turso console

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild
- Check Node.js version is 20 or higher

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- Turso for database infrastructure
- Prisma for database ORM
- NextAuth.js for authentication solution
