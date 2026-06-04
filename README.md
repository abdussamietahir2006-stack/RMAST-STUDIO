<div align="center">

<h1>RMAST Studio Portfolio 🌱</h1>

<p>Personal portfolio & studio website for RMAST Studio — a full-stack digital studio building products for founders and brands worldwide.</p>

[![Website](https://img.shields.io/badge/Website-rmast-studio.vercel.app/-52b788?style=for-the-badge&logo=google-chrome&logoColor=white)]((https://rmast-studio.vercel.app/))
[![Status](https://img.shields.io/badge/Status-Live-52b788?style=for-the-badge)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000?style=for-the-badge&logo=nextdotjs)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript)]()

</div>

---

## 🌿 What is this?

This is the official portfolio and studio website for **RMAST Studio** — a one-person digital studio founded by Raja Muhammad Abdussamie Tahir, building end-to-end digital products for founders, brands, and startups worldwide.

The site showcases services, projects, testimonials, and includes a full CMS-powered admin dashboard — all built inside a single Next.js app with no separate backend.

---

## ✨ Features

### Public Website
- 🏠 **Home** — Hero, services preview, process, testimonials, newsletter
- 👤 **About** — Story, team, stats, values, mission & vision
- 🗂️ **Projects** — Grid & 3D orbital view, filters, showcase
- 🛠️ **Services** — Service details, FAQ, booking system
- 📬 **Contact** — Contact form, booking wizard, FAQ

### Admin CMS Dashboard
- 🔐 **JWT Authentication** — secure login, protected routes
- 📁 **Projects CMS** — add, edit, delete, drag to reorder
- 💬 **Testimonials** — approve, reject, delete
- 📅 **Bookings** — status management (pending/confirmed/cancelled)
- 📧 **Subscribers** — newsletter list, copy all emails
- 👥 **Leads** — contact form submissions
- ✏️ **Content Editor** — edit hero, about, stats, services, navbar, footer
- 🖼️ **Image Uploads** — drag & drop Cloudinary uploader
- 📊 **Dashboard** — live stats with auto-refresh

### Design & Animation
- 🎨 Dark forest green theme (`#07130f`, `#0b1f18`, `#52b788`)
- ⚡ Heavy Framer Motion animations throughout
- 🌐 3D orbital project view with orbital physics
- 🖱️ Magnetic hover effects, tilt cards, particle bursts
- 📱 Fully mobile responsive

---

## 🛠️ Tech Stack

### Frontend & Framework
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Animations
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

### Backend (API Routes)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### UI & Icons
![Lucide](https://img.shields.io/badge/Lucide-000?style=for-the-badge&logo=lucide&logoColor=white)
![React Icons](https://img.shields.io/badge/React_Icons-E91E63?style=for-the-badge&logo=react&logoColor=white)

---

## 🏗️ Project Structure
rmast-portfolio/
├── app/
│   ├── page.tsx                  # Home
│   ├── about/page.tsx            # About
│   ├── projects/page.tsx         # Projects
│   ├── services/page.tsx         # Services
│   ├── admin/                    # CMS Dashboard
│   │   ├── login/                # Auth
│   │   ├── dashboard/            # Stats
│   │   ├── projects/             # Projects CMS
│   │   ├── testimonials/         # Testimonials CMS
│   │   ├── bookings/             # Bookings CMS
│   │   ├── subscribers/          # Subscribers CMS
│   │   ├── leads/                # Leads CMS
│   │   └── content/              # Content CMS
│   └── api/                      # Next.js API Routes
│       ├── auth/                 # Login & verify
│       ├── projects/             # Projects CRUD
│       ├── testimonials/         # Testimonials CRUD
│       ├── bookings/             # Bookings CRUD
│       ├── subscribers/          # Subscribers
│       ├── leads/                # Leads
│       ├── content/              # CMS content
│       ├── upload/               # Cloudinary upload
│       └── dashboard/            # Stats
│
├── components/
│   ├── shared/                   # Navbar, Footer
│   ├── home/                     # Home sections
│   ├── about/                    # About sections
│   ├── projects/                 # Projects sections
│   ├── services/                 # Services sections
│   ├── contact/                  # Contact sections
│   └── admin/                    # Admin components
│
├── lib/
│   ├── db.ts                     # MongoDB connection
│   ├── auth.ts                   # JWT utilities
│   ├── cloudinary.ts             # Image upload
│   └── models/                   # Mongoose models
│       ├── Admin.ts
│       ├── Project.ts
│       ├── Testimonial.ts
│       ├── Booking.ts
│       ├── Subscriber.ts
│       ├── Lead.ts
│       └── SiteContent.ts
│
└── public/                       # Static assets

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/abdussamietahir2006-stack/rmast-portfolio.git

# Install dependencies
cd rmast-portfolio
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open `http://localhost:3000`

---

## 🔐 Environment Variables

Create `.env.local` in the root:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_strong_random_secret_min_32_chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🌐 API Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Admin login |
| GET | `/api/auth/me` | ✅ | Verify token |
| GET/POST | `/api/projects` | GET ❌ POST ✅ | Projects |
| PUT/DELETE | `/api/projects/[id]` | ✅ | Update/Delete project |
| GET/POST | `/api/testimonials` | GET ❌ POST ❌ | Testimonials |
| PUT/DELETE | `/api/testimonials/[id]` | ✅ | Update/Delete testimonial |
| GET/POST | `/api/bookings` | GET ✅ POST ❌ | Bookings |
| GET/POST | `/api/subscribers` | GET ✅ POST ❌ | Subscribers |
| GET/POST | `/api/leads` | GET ✅ POST ❌ | Leads |
| GET/PUT | `/api/content/[section]` | GET ❌ PUT ✅ | CMS Content |
| POST | `/api/upload` | ✅ | Image upload |
| GET | `/api/dashboard/stats` | ✅ | Dashboard stats |

---

## 🌱 CMS Sections

The content editor supports these sections:

| Section | Fields |
|---|---|
| `hero` | headline, subheadline, CTA, images |
| `about` | story, mission, vision, images |
| `stats` | projects, clients, experience, lines of code |
| `services` | title, description, icon, image per service |
| `navbar` | logo, links, CTA button |
| `footer` | brand, social links, footer links, contact info |

---

## 📸 Screenshots

> Coming soon — portfolio, admin dashboard, and CMS previews.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#07130f` |
| Surface | `#0b1f18` |
| Accent | `#52b788` |
| Text | `#e8f5ec` (ivory) |
| Font | Syne (headings) · DM Sans (body) |

---

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## 📄 License

Private project — © 2025 RMAST Studio. All rights reserved.

---

<div align="center">

*"We don't build websites. We grow digital ecosystems."* 🌱

Built by **RMAST Studio**

[![Instagram](https://img.shields.io/badge/Instagram-@rmaststudio-E4405F?style=for-the-badge&logo=instagram)](https://instagram.com/rmaststudio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Raja%20Abdussamie-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/raja-muhammad-abdussamie-tahir-b70121413)
[![Email](https://img.shields.io/badge/Email-rmaststudio@gmail.com-D14836?style=for-the-badge&logo=gmail)](mailto:rmaststudio@gmail.com)

</div>
