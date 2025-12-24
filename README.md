# BlogSpace - Full-Stack Blog Platform

A modern, full-stack blog website built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and NextAuth.js for authentication.

## ✨ Features

- **Full Authentication System**
  - Email/Password login and registration
  - Google OAuth integration
  - Protected routes (Dashboard)
  - Session management with NextAuth.js

- **Beautiful Blog Design**
  - Responsive layout with Tailwind CSS
  - Dark/light mode toggle
  - Professional typography and animations
  - SEO optimized with metadata

- **Premium Blog Post**
  - "How Transformational Leadership Motivates People?"
  - Real-life examples (Nelson Mandela, Anuradha Koirala)
  - Beautiful prose styling
  - Share-ready with Open Graph tags

## 🚀 Quick Start

### 1. Install Dependencies

**Note:** If you get PowerShell execution policy errors, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then install:

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file has been created. Update it with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-a-secret-key>
GOOGLE_CLIENT_ID=<optional-your-google-client-id>
GOOGLE_CLIENT_SECRET=<optional-your-google-client-secret>
```

**Generate a secret key (in PowerShell):**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or online: https://generate-secret.vercel.app/32

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
blog-website/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/         # Protected routes
│   │   └── dashboard/
│   ├── api/                 # API routes
│   │   ├── auth/[...nextauth]/
│   │   └── register/
│   ├── blog/                # Blog posts
│   │   └── transformational-leadership/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── auth/                # Auth components
│   ├── blog/                # Blog components
│   └── layout/              # Layout components
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── db.ts                # Database (in-memory)
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript types
└── data/
    └── blogs.ts             # Blog post data
```

## 🎨 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Authentication:** NextAuth.js v5
- **Icons:** React Icons
- **Validation:** Zod
- **Password Hashing:** bcryptjs

## 🔐 Authentication

### Testing Authentication Locally

1. **Register a new account:**
   - Go to `/register`
   - Fill in name, email, and password
   - You'll be auto-logged in and redirected to dashboard

2. **Login with credentials:**
   - Go to `/login`
   - Use your registered email and password

3. **Google OAuth (Optional):**
   - Set up Google OAuth credentials
   - Add them to `.env.local`
   - Click "Sign in with Google"

## 📝 Blog Content

The blog post **"How Transformational Leadership Motivates People?"** includes:

- Introduction to transformational leadership
- Historical context (James Downton, Bernard Bass)
- Real-life examples:
  - Nelson Mandela's leadership in post-apartheid South Africa
  - Anuradha Koirala's work with Maiti Nepal
- Conclusion on the impact of transformational leadership

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions to Vercel.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Blog Posts

1. Add post data to `data/blogs.ts`
2. Create page in `app/blog/[slug]/page.tsx`
3. Add content and metadata

## 📦 Dependencies

### Core
- next: 16.1.0
- react: 19.2.3
- react-dom: 19.2.3
- next-auth: 5.0.0-beta.25

### Utilities
- react-icons: ^5.3.0
- bcryptjs: ^2.4.3
- zod: ^3.23.8

### Dev Dependencies
- typescript: ^5
- tailwindcss: ^4
- eslint: ^9
- Various @types packages

## 🔄 Database Note

Currently using **in-memory storage** for demo purposes. Users are reset when the server restarts.

### For Production, use:
- **Vercel Postgres** (free tier)
- **Supabase** (free tier)
- **MongoDB Atlas** (free tier)
- **PlanetScale** (free tier)

## 🎯 Future Enhancements

- [ ] Add real database integration
- [ ] Implement comment system
- [ ] Add search functionality
- [ ] Create admin panel for content management
- [ ] Add more blog posts
- [ ] Implement like/bookmark features
- [ ] Add user profiles
- [ ] RSS feed

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using Next.js and TypeScript**


