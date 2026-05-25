# Blog App Project Prompt

## Context and Role

You are building a blog application from scratch as a fullstack developer. The main goal here is to create something that feels really well made. It should not just work well. Also be enjoyable to read and navigate. The platform needs to use Framer Motion for animations that happen when you scroll. The platform should also be fast, easy to use and ready for production.

This journey should start from the hero section, go through articles into categories and end with subscribing or getting in touch.

The platform also needs a working backend, a newsletter subscription system, a contact form and email notifications to the blog owner whenever someone reaches out or subscribes.

---

## Objective

- Scroll based animations using Framer Motion throughout the site
- Smooth page transitions between all routes
- Full CRUD for posts, categories and tags
- A rich text editor for writing and editing posts
- A newsletter subscribe modal (animated with email confirmation)
- A contact form modal (animated with email to owner)
- Secure logging of all form submissions
- SEO ready pages with meta tags, Open Graph and a sitemap

---

## Pages

**Home** — This is the first impression. Begin with the animated hero that reveals the headline word by word. Below that, show a featured post prominently, then a grid of recent articles that fade in as the user scrolls. Include category pill filters and a newsletter CTA near the bottom.

**Blog Feed (`/blog`)** — A browsable list of all posts. Users can filter by category or tag, sort by latest, popular, or trending and paginate or scroll infinitely. Animate the cards as they come into view.

**Single Post (`/blog/[slug]`)** — This is where the most care goes. Show a reading progress bar at the top that fills as the user scrolls. The cover image should have a slight background movement effect when you scroll below. Article sections should reveal as you scroll into them. At the bottom, show the author bio, related posts and a comment section. Include like, bookmark and share buttons with small satisfying animations.

**Category and Tag Pages (`/category/[slug]`, `/tag/[slug]`)** — Simple filtered views with an animated entrance and a short category description at the top.

**Author / About Page (`/about` or `/author/[id]`)** — Animated profile with bio, social links and a list of the author's posts.

**Search (`/search`)** — Live search with debounced API calls. Results animate in. If nothing is found, show a thoughtful empty state with an animation.

**Admin Dashboard (`/admin`, protected)** — Where content gets managed. Authors can create, edit and delete posts using a rich text editor. Images can be uploaded with a preview. Categories and tags can be managed here too. Admins can also see contact submissions and newsletter subscribers.

---

## Animations

Use Framer Motion `useInView` and `motion` components throughout. The general approach is:

- Hero text reveals with staggered word or letter animations using `variants` and `staggerChildren`
- Blog cards fade in and slide up as they enter the viewport, staggered by index
- The reading progress bar uses a smooth `scaleX` transform on a fixed element at the top
- Modals use `AnimatePresence` so they animate in and out cleanly
- Page transitions are handled with `AnimatePresence` at the route level — a simple fade or slide works well
- Small interactions like the like button (pulse), bookmark (flip) and share (pop) make the experience feel alive

---

## Layout and Responsiveness

The navbar should stick to the top and adjust its opacity and backdrop blur as the user scrolls. The footer should have a newsletter CTA, social links and sitemap navigation.

On mobile it's a single column with a collapsible nav. On the tablet it opens to two columns. On the desktop it goes to three columns with a sidebar on post pages.

Every interactive element needs ARIA labels. Modals need focus trapping. Use semantic HTML throughout — `article`, `nav`, `main`, `aside`, `header`, `footer`. Color contrast should meet WCAG AA at minimum. Include a skip to content link for screen readers.

---

## Contact Form

The "Get in Touch" button opens a modal that uses Framer Motion for animation. The modal keeps the focus while it's open and closes when the user clicks back button. The form collects the name (required), email (required), phone number (required), subject (required) and message (optional). Validation occurs on the client side, providing clear inline error messages if any. A spinner appears during submission and a toast notification shows whether the submission was successful or failed on submit.

On the backend, submissions are logged and an email is sent to the blog owner with all the submitted details including a timestamp.

---

## Newsletter

The subscribe CTA opens a modal with a scale and fade animation. The form just asks for a name and email, both required.

When someone subscribes, three things happen — the subscriber is saved to the database, a confirmation email goes to them and a notification email goes to the blog owner. After a successful subscription show a satisfying success animation that is something that feels like a small celebration.

---

## Backend

Build a RESTful API with the following endpoints:

- **Posts** — GET all (with pagination, filters, sort), GET by slug, POST (admin), PUT (admin), DELETE (admin)
- **Categories and tags** — GET all categories, GET all tags, POST new category (admin)
- **Comments** — GET comments for a post, POST a new comment, DELETE a comment (admin)
- **Contact and newsletter** — POST contact form submission, POST newsletter subscription
- **Auth** — POST login (returns JWT), POST logout, GET current user
- **Search** — GET with a query string for full-text search across posts

For emails, use Nodemailer with SMTP. Contact submissions send an email to the owner. Newsletter subscriptions send a confirmation to the subscriber and a notification to the owner.

All credentials go in environment variables via `dotenv`. JWT protects admin routes. Rate limiting goes on all public endpoints using `express-rate-limit`. Sanitize every input to prevent XSS and injection. CORS should only allow trusted origins.

---

## Data Models

- **Post** — id, title, slug, rich HTML content, cover image, author reference, category reference, tag references, a status (draft or published), reading time, like count, view count and timestamps for created, updated and published
- **Author** — id, name, email, avatar, bio, social links and a role
- **Comment** — id, post reference, name, email, content, an approved flag and a created timestamp
- **Subscriber** — id, name, email and a subscribed timestamp
- **Contact Submission** — id, name, email, phone, subject, message and a created timestamp

---

## Database Seeding

Include a seed script at `backend/src/scripts/seed.js`. When run with `npm run seed`, it should clean and remove existing data and insert the following into the database:

- One default admin author with a name, email, avatar URL, bio and social links
- Five blog posts published. Each has a different title, slug, rich html content (at least three paragraphs), an excerpt, a cover image url, category, one or two tags, a realistic reading time and a published timestamp. The 5 posts should be from at least two different categories (e.g. Technology, Design, Productivity) and use diverse tags so that the category and tag filter pages have some meaningful content to display
- The categories and tags referenced by the posts
- Three sample newsletter subscribers
- Two sample contact submissions

The seed script should log a success message for each inserted collection and exit cleanly. Add a note in the README explaining how to run it.

---

## Rich Text Editor

Use TipTap. The toolbar should support bold, italic, underline, headings H1 through H3, blockquote, code block, bullet list, numbered list, links and image upload. Images upload to Cloudinary or S3 and get inserted by URL. The output is sanitized HTML stored in the database. Include a preview mode so authors can toggle between editing and seeing the rendered result.

---

## SEO

Every page needs a dynamic title and meta description using Next.js Metadata API. Post and category pages need Open Graph and Twitter Card tags. Article and author pages should include JSON-LD structured data. Generate `sitemap.xml` and `robots.txt` automatically. Every page needs a canonical URL and every post image needs an alt attribute.

---

## API Responses

Always return structured JSON.

**Success:**
```json
{ "success": true, "data": {}, "message": "Post retrieved successfully." }
```

**Error:**
```json
{ "success": false, "error": "Validation failed.", "details": { "email": "Invalid email format." } }
```

---

## Error Handling

**Frontend** — Show inline validation errors in forms, toast notifications for API responses, a custom animated 404 page for missing posts and graceful messaging for network failures.

**Backend** — Return structured errors with proper HTTP status codes, log failures with timestamps, handle database connection issues gracefully and fall back cleanly if the email service is unavailable.

---

## Performance

Split the bundle. Lazy load images using Next.js's `Image` component. Lazy-load the editor and modals with `React.lazy` and `Suspense`. Cache post lists and categories with Redis or SWR. Debounce the search input at 300ms. Index the database on frequently queried fields. Paginate all list endpoints at 10 items per page by default.

---

## Tech Stack

- **Frontend** — Next.js (App Router), Framer Motion, Tailwind CSS, TipTap, SWR or React Query, React Hook Form with Zod, react-hot-toast
- **Backend** — Node.js with Express, Nodemailer, JWT, express-rate-limit, dotenv, sanitize-html or DOMPurify
- **Database and storage** — MongoDB with Mongoose. Cloudinary for images. Redis optionally for caching
- **Deployment** — Both frontend and backend together on Railway

---

## Folder Structure

Root folder should have `frontend`, `backend` and `README.md`. Inside frontend, follow Next.js structure. Inside backend, follow Express.js structure.

---

## Documentation

The README should cover how to run the project locally, how to configure environment variables, how to set up `.env.example` and seed the database and how to deploy on Railway. Also include a quick reference for all API endpoints.
