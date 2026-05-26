# Blog Platform - Golden Prompt

## Context and Role

You are a fullstack developer building a content first blog platform from the ground up. The product needs to feel genuinely well crafted and good, not just functional. Every section of the page should tell a story as the user scrolls through it with animations that feel intentional not decorative. The platform handles real publishing workflows which is writing, editing, categorizing and distributing content to subscribers. It also has a working backend that logs contact submissions and sends email notifications to the blog owner.

## Objective

Build a production ready blog platform that covers the following

- Scroll triggered storytelling animations using Framer Motion across all pages
- Smooth animated page transitions at the route level
- Full CRUD operations for posts, categories and tags
- A rich text editor for drafting and editing posts
- An animated newsletter subscription modal with email confirmation
- An animated contact form modal that emails the blog owner on submission
- Secure server side logging of all form submissions
- SEO optimized pages with meta tags, Open Graph and a sitemap

**Pages to build:**

- **Home** - Animated hero that reveals the headline word by word. Below it one featured post, a grid of recent articles that animate in on scroll, category pill filters and a newsletter CTA at the bottom.
- **Blog Feed (`/blog`)** - Full post list with category and tag filtering, sort options (latest, popular, trending) and pagination. Cards animate in as they enter the viewport.
- **Single Post (`/blog/[slug]`)** - Reading progress bar at the top. Cover image with a subtle parallax effect on scroll. Article sections reveal as they come into view. At the bottom author bio, related posts and a comment section. Like, bookmark and share buttons with small motion interactions.
- **Category Page (`/category/[slug]`) and Tag Page (`/tag/[slug]`)** - Filtered post views with an animated entrance and a short description at the top.
- **About / Author Page** - Animated profile section, bio, social links and the author's post list.
- **Search (`/search`)** - Live results with a 300ms debounced API call. Results animate in. Empty states have a thoughtful fallback animation.
- **Admin Dashboard (`/admin`, protected)** - Create, edit and delete posts using the rich text editor. Upload images with preview. Manage categories and tags. View contact submissions and subscriber records.


## Input Data and Requirements

**Contact Form Fields**
- Name (required)
- Email (required, must be a valid email format)
- Phone number (required, numeric validation)
- Subject (required)
- Message (optional)

**Newsletter Subscription Fields**
- Name (required)
- Email (required, must be a valid email format)

**Post Data Model**
- id, title, slug, rich HTML content, cover image URL, author reference, category reference, tag references
- Status: draft or published
- Reading time (auto calculated)
- Like count, view count
- Timestamps: created, updated, published

**Other Models**
- Author: id, name, email, avatar, bio, social links, role
- Comment: id, post reference, name, email, content, approved flag, created timestamp
- Subscriber: id, name, email, subscribed timestamp
- Contact Submission: id, name, email, phone, subject, message, created timestamp

**Database Seeding**

Include a seed script at `backend/src/scripts/seed.js`, runnable with `npm run seed`. It should:
- Clear existing records first
- Insert one default admin author with name, email, avatar URL, bio and social links
- Insert five published posts across at least two categories (e.g., Technology, Design, Productivity) with at least three paragraphs of rich HTML content each, realistic reading times and a cover image URL per post
- Insert the categories and tags used by those posts
- Insert three sample newsletter subscribers
- Insert two sample contact submissions
- Log a success message per collection and exit cleanly


## Data Processing

**Animations**
- Hero text: staggered word or letter reveal using Framer Motion `variants` and `staggerChildren`
- Blog cards: fade in and slide up on viewport entry, staggered by index using `useInView`
- Reading progress bar: smooth `scaleX` transform on a fixed top element
- Modals: `AnimatePresence` for clean entrance and exit
- Page transitions: `AnimatePresence` at the route level - a simple fade or directional slide
- Micro-interactions: like button pulse, bookmark flip, share pop

**Sticky Navbar**
Adjusts opacity and backdrop blur as the user scrolls. Collapses to a hamburger on mobile.

**Rich Text Editor (TipTap)**
Toolbar supports: bold, italic, underline, H1–H3, blockquote, code block, bullet list, numbered list, links and image upload. Images upload to Cloudinary or S3 and are inserted by URL. Output is sanitized HTML stored in the database. Authors can toggle between edit mode and a rendered preview.

**Search**
Debounced at 300ms. Performs full-text search across post titles, content and tags. Results are paginated at 10 per page.

**Authentication**
JWT-protected admin routes. POST login returns a token. Token is sent in the Authorization header for all admin API calls.

**Input Sanitization**
Sanitize all user-submitted inputs server-side using `sanitize-html` or `DOMPurify` before writing to the database. This applies to all form fields and rich text editor output.

**Rate Limiting**
Apply `express-rate-limit` to all public-facing endpoints (contact, newsletter, search, comments).

**Email Logic**
- Contact form submission → email sent to blog owner with name, email, phone, subject, message and timestamp
- Newsletter subscription → confirmation email to subscriber + notification email to owner
- Use Nodemailer with SMTP. All credentials stored in environment variables via `dotenv`


## Output Requirements

**API Responses**

All endpoints return structured JSON.

Success:
```json
{ "success": true, "data": {}, "message": "Post retrieved successfully." }
```

Error:
```json
{ "success": false, "error": "Validation failed.", "details": { "email": "Invalid email format." } }
```


**REST API Endpoints**

Public endpoints:
- `/api/posts` - all posts with pagination, filters, and sort
- `/api/posts/:slug` - single post by slug
- `/api/categories` - all categories
- `/api/tags` - all tags
- `/api/comments/:postId` (GET) - fetch comments for a post
- `/api/comments/:postId` (POST) - submit a new comment
- `/api/contact` - handle contact form submissions
- `/api/newsletter` - register a new subscriber
- `/api/search` - full-text search across posts using a query string
- `/api/auth/login` - submit credentials and receive a JWT

Admin only endpoints:
- `/api/posts` (POST) - create a new post
- `/api/posts/:id` (PUT) - update an existing post
- `/api/posts/:id` (DELETE) - remove a post
- `/api/categories` (POST) - create a new category
- `/api/comments/:id` (DELETE) - remove a comment
- `/api/auth/me` (GET) - return the currently authenticated user

**SEO Output**
- Dynamic `<title>` and `<meta name="description">` per page using Next.js Metadata API
- Open Graph and Twitter Card tags on post and category pages
- JSON-LD structured data on article and author pages
- Auto-generated `sitemap.xml` and `robots.txt`
- Canonical URLs on every page
- Alt text on every post image

**Contact Form UX**
- Spinner visible during submission
- Toast notification on success or failure
- Modal closes and shows a success state after confirmed submission

**Newsletter UX**
- Scale and fade animation on modal open
- After successful subscription: a small celebratory success animation
- Confirmation email to subscriber triggered automatically


## Error Handling

**Frontend**
- Inline validation errors on all form fields before submission
- Toast notifications for API success and failure responses
- Custom animated 404 page for missing posts or routes
- Graceful messaging for network failures or timeouts

**Backend**
- Return structured JSON errors with proper HTTP status codes (400 for validation, 401 for auth, 500 for server)
- Log all failures with a timestamp and request context
- If the email service is unavailable, log the failure and return a graceful error - do not crash the submission flow
- Handle database connection failures gracefully with a startup check and retry logic


## Performance and Scalability

- Split the bundle by route using Next.js dynamic imports
- Lazy load the rich text editor and modals with `React.lazy` and `Suspense`
- Use Next.js `Image` component for lazy image loading with correct `alt` attributes
- Cache post list and category data with SWR or React Query (stale-while-revalidate strategy)
- Debounce search input at 300ms
- Paginate all list endpoints at 10 items per page by default
- Index MongoDB on: `slug`, `category`, `tags`, `status`, `publishedAt`
- CORS restricted to trusted origins only
- Animations use only `transform` and `opacity` to stay GPU-friendly and avoid layout thrashing

## Tech Stack

**Frontend**
- Next.js (App Router)
- Framer Motion
- Tailwind CSS
- TipTap (rich text editor)
- SWR or React Query
- React Hook Form with Zod
- react-hot-toast

**Backend**
- Node.js with Express
- Nodemailer (SMTP)
- JWT for auth
- express-rate-limit
- dotenv
- sanitize-html or DOMPurify

**Database and Storage**
- MongoDB with Mongoose
- Cloudinary for image uploads
- Redis (optional for caching)

**Deployment**
- Frontend and backend together on Railway


## Documentation

The README must include:
- How to run the project locally (frontend and backend separately)
- How to configure environment variables with a working `.env.example`
- How to run the seed script (`npm run seed`) and what it inserts
- All API endpoints with method, path, auth requirement and a one line description
- Deployment steps for Railway
