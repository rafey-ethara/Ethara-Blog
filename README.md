# Ethara Blog

A production-ready full-stack blog platform built with **Next.js 14**, **Express**, **MongoDB**, **Framer Motion** and **TipTap**. It has scroll-based animations, a rich text editor, newsletter subscriptions, a contact form with email notifications and a full admin dashboard.

---

## Features

- **Scroll-based animations** - Framer Motion `useInView`, `AnimatePresence` and staggered reveals
- **Page transitions** - smooth fade/slide between all routes
- **Full CRUD** - posts, categories and tags via admin dashboard
- **Rich text editor** - TipTap with full toolbar (bold, italic, headings, code blocks, images and links)
- **Newsletter modal** - animated with confetti success state and dual email notifications
- **Contact modal** - animated, focus-trapped and sends email to owner
- **Reading progress bar** - smooth scaleX transform at top of post pages
- **Parallax cover images** - on single post pages
- **Live search** - debounced at 300ms with animated results
- **SEO-ready** - dynamic metadata, Open Graph, Twitter Cards, JSON-LD, sitemap and robots.txt
- **Admin dashboard** - protected by JWT with full post management
- **Rate limiting** - on all public endpoints
- **Input sanitization** - XSS protection on all form inputs

---

## Project Structure

```
Ethara-Blog/
├── frontend/          # Next.js 14 App Router (TypeScript + Tailwind)
├── backend/           # Express API (Node.js + MongoDB)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Gmail account with App Password (for emails)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** - copy and fill in:
```bash
cp backend/.env.example backend/.env
```

Fill in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ethara-blog
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=studentsenior.demo@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password    # Get from Google Account > Security > App Passwords
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGINS=http://localhost:3000
```

**Frontend** - copy and fill in:
```bash
cp frontend/.env.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Ethara Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A modern blog about technology, design and productivity.
```

### 3. Seed the Database

The seed script clears all existing data and inserts:
- 1 admin author
- 3 categories (Technology, Design, Productivity)
- 5 tags (AI, Web Dev, CSS, Figma, Focus)
- 5 published blog posts
- 3 newsletter subscribers
- 2 contact submissions

```bash
cd backend
npm run seed
```

You will see output like:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Author created: Alex Carter (email: alex@ethara.blog, password: Admin@1234)
✅ Categories created: Technology, Design, Productivity
✅ Tags created: AI, Web Dev, CSS, Figma, Focus
✅ Posts created: The Future of AI...
✅ Subscribers created: 3 subscribers
✅ Contact submissions created: 2 submissions
🎉 Database seeded successfully!
👤 Admin login: alex@ethara.blog / Admin@1234
```

### 4. Run Locally

**Backend** (terminal 1):
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Frontend** (terminal 2):
```bash
cd frontend
npm run dev
# App running at http://localhost:3000
```

### 5. Access the Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Email: `alex@ethara.blog`
3. Password: `Admin@1234`

---

## Email Setup (Gmail)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to **App Passwords** and generate a password for "Mail"
4. Use that 16-character password as `SMTP_PASS` in your `.env`

---

## Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard and copy your Cloud Name, API Key and API Secret
3. Add them to `backend/.env`

---

## Deploy to Railway (Single Monorepo)

### Frontend Service

1. Create a new Railway project
2. Add a service and connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Build Command** to `npm run build`
5. Set **Start Command** to `npm start`
6. Add all `NEXT_PUBLIC_*` environment variables

### Backend Service

1. In the same Railway project add another service
2. Set **Root Directory** to `backend`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `npm start`
5. Add all backend environment variables
6. Add a MongoDB plugin (Railway has native MongoDB support)

### Connect Them

- Copy the backend service's public URL
- Set `NEXT_PUBLIC_API_URL` in the frontend service to `https://your-backend.railway.app/api`
- Set `CORS_ORIGINS` in the backend to `https://your-frontend.railway.app`

---

## API Reference

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | Public | Get all posts (paginate: `?page=1&limit=10`, filter: `?category=id&tag=id`, sort: `?sort=latest\|popular\|trending`) |
| GET | `/api/posts/:slug` | Public | Get post by slug (increments viewCount) |
| POST | `/api/posts` | Admin | Create post |
| PUT | `/api/posts/:id` | Admin | Update post |
| DELETE | `/api/posts/:id` | Admin | Delete post |
| POST | `/api/posts/:id/like` | Public | Like a post |

### Categories & Tags
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | All categories |
| GET | `/api/categories/:slug` | Public | Single category |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |
| GET | `/api/tags` | Public | All tags |
| POST | `/api/tags` | Admin | Create tag |
| DELETE | `/api/tags/:id` | Admin | Delete tag |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/comments/:postId` | Public | Comments for a post |
| POST | `/api/comments/:postId` | Public | Add comment |
| DELETE | `/api/comments/:id` | Admin | Delete comment |

### Contact & Newsletter
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Submit contact form (rate limited: 10/15min) |
| POST | `/api/newsletter` | Public | Subscribe to newsletter (rate limited: 10/15min) |

### Search
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/search?q=query` | Public | Full-text search across posts |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login and returns JWT |
| POST | `/api/auth/logout` | Auth | Logout (client-side token clear) |
| GET | `/api/auth/me` | Auth | Get current user |

### Admin (JWT Required)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/contacts` | Admin | All contact submissions |
| DELETE | `/api/admin/contacts/:id` | Admin | Delete submission |
| GET | `/api/admin/subscribers` | Admin | All subscribers |
| DELETE | `/api/admin/subscribers/:id` | Admin | Remove subscriber |
| GET | `/api/admin/comments` | Admin | All comments |
| POST | `/api/upload` | Admin | Upload image to Cloudinary |

### API Response Format

**Success:**
```json
{ "success": true, "data": {}, "message": "Post retrieved successfully." }
```

**Error:**
```json
{ "success": false, "error": "Validation failed.", "details": { "email": "Invalid email format." } }
```

---

## Health Check

```bash
curl http://localhost:5000/api/health
# {"success":true,"message":"Ethara Blog API is running","timestamp":"..."}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS + Custom CSS Design System |
| Animations | Framer Motion |
| Rich Editor | TipTap |
| Forms | React Hook Form + Zod |
| Data Fetching | SWR + Axios |
| Toasts | react-hot-toast |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Email | Nodemailer (SMTP/Gmail) |
| Images | Cloudinary |
| Rate Limiting | express-rate-limit |
| Sanitization | sanitize-html + express-mongo-sanitize |
| Deployment | Railway |

---

## License

MIT - feel free to use and adapt.
