# 💎 Dazzler Diam Jewels — Full Platform

A cinematic luxury diamond jewellery platform with inquiry system and admin dashboard.

---

## 🗂 Repository Structure

```
dazzler-diam/
├── frontend/          → Next.js 14 (Deploy to Vercel)
├── backend/           → Node.js + Express (Deploy to Render)
└── google-apps-script/ → Google Sheets integration
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/dazzler-diam.git
cd dazzler-diam

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your values
```

### 3. Set Up MongoDB Atlas (Free)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow all for development)
5. Get connection string → paste into `MONGODB_URI` in `backend/.env`

### 4. Seed the Database

```bash
cd backend
node src/utils/seed.js
```

This creates your admin account using the credentials in `.env`.

### 5. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev
# Runs on http://localhost:3000
```

---

## 📧 Email Setup (Gmail SMTP — Free)

1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Create an App Password for "Mail"
4. Add to `backend/.env`:
   ```
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  (16-char app password)
   ```

---

## 📊 Google Sheets Integration

### Option A: Service Account (Backend — Recommended)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable Google Sheets API
3. IAM → Service Accounts → Create
4. Download JSON key
5. Extract `client_email` and `private_key` → add to `backend/.env`
6. Create a Google Sheet → Share it with the service account email (Editor)
7. Copy the Sheet ID from the URL → add as `GOOGLE_SHEETS_ID`
8. Run: `node -e "require('./src/utils/googleSheets').initSheet()"`

### Option B: Apps Script Webhook

1. Open your Google Sheet
2. Extensions → Apps Script
3. Paste contents of `google-apps-script/Code.gs`
4. Save → Deploy → New deployment → Web app
5. Execute as: Me | Access: Anyone
6. Run `onOpen()` manually, then `initHeaders()`
7. Use the Web App URL in your backend as a webhook URL

---

## 🌐 Production Deployment

### Frontend → Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Follow prompts:
# - Link to your GitHub repo
# - Framework: Next.js (auto-detected)
# - Add environment variables in Vercel dashboard
```

**Environment variables to add in Vercel:**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+919999999999
```

**Custom domain:**
1. Vercel dashboard → Project → Settings → Domains
2. Add `dazzlerdiamjewels.com`
3. Update DNS at your registrar:
   ```
   A     @     76.76.19.19
   CNAME www   cname.vercel-dns.com
   ```

### Backend → Render (Free)

```bash
# Push backend to GitHub
git push origin main

# Go to render.com → New → Web Service
# Connect GitHub → select dazzler-diam repo
# Root directory: backend
# Build command: npm install
# Start command: npm start
# Add all environment variables from .env
```

**After deploy:**
```bash
# Seed the production database
NODE_ENV=production node src/utils/seed.js
```

---

## 🔐 Admin Access

After deployment, visit:
```
https://yourdomain.com/admin/login

Email:    (your ADMIN_EMAIL from .env)
Password: (your ADMIN_PASSWORD from .env)
```

**⚠️ Change your password immediately after first login.**

---

## 👥 User Roles

| Role | Access |
|------|--------|
| `founder` | Full access to everything |
| `ceo` | Full access (hidden from team view) |
| `hr_manager` | Team management |
| `sales` | Inquiries, appointments |
| `marketing` | Blog, products, analytics |
| `supplier_collab` | Supplier management |
| `influencer_collab` | Influencer/partner management |
| `business_partner` | Read-only products & inquiries |

---

## 🛠 Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 + TypeScript | Free |
| Styling | Tailwind CSS + Custom CSS | Free |
| Animations | GSAP + Framer Motion | Free |
| Smooth Scroll | Lenis | Free |
| Backend | Node.js + Express | Free |
| Database | MongoDB Atlas M0 | Free |
| Frontend Hosting | Vercel | Free |
| Backend Hosting | Render | Free |
| Email | Gmail SMTP | Free |
| Images | Cloudinary (free tier) | Free |
| Spreadsheet | Google Sheets + Apps Script | Free |
| Analytics | Google Analytics 4 | Free |

---

## 📱 Social Links

- Instagram: [@dazzler_dja](https://www.instagram.com/dazzler_dja)
- Pinterest: [pin.it/6nzITgG0o](https://pin.it/6nzITgG0o)
- YouTube: [@dazzlerdja](https://youtube.com/@dazzlerdja)

---

## 📞 Support & Inquiries

All customer inquiries go through the Diamond Configurator → stored in MongoDB → synced to Google Sheets → email sent to admin → confirmation sent to customer.

No direct checkout. Pure inquiry-based luxury sales model.
