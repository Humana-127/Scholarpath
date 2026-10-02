# 🎓 ScholarPath

**Discover Your Perfect Scholarship. Funded. Tracked. Secured.**

ScholarPath is a modern web application designed to help students discover, track, and manage scholarship opportunities with ease. Built with **Next.js**, **Supabase**, and **Tailwind CSS**, it provides a seamless experience from discovery to application.

## ✨ Key Features

- **🚀 Smart Matching**: Profile-based scholarship recommendations.
- **🛡️ Secure Auth**: Username-based login backed by Supabase Auth.
- **📄 Document Locker**: Securely upload and manage certificates and IDs.
- **🏛️ Bank Sync**: Direct benefit transfer ready with bank detail management.
- **📊 Tracking Dashboard**: Real-time status updates on all your applications.
- **📱 Responsive Design**: Fully optimized for Web, Tablet, and Mobile.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, React 19, Tailwind CSS
- **Backend**: Supabase (Auth, Postgres DB, Storage)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: React Hook Form + Zod

## 🚀 Quick Start

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-username/scholarpath-ui.git
   cd scholarpath-ui
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 📜 Database Setup

Ensure you run the SQL scripts in `supabase/` in your Supabase SQL Editor:
1. `schema.sql` - Core table structure
2. `rls_fix.sql` - Row Level Security and Helper triggers

---
Built with ❤️ by the ScholarPath Team.
