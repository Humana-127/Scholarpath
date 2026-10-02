# 🚀 ScholarPath Deployment Guide

Your application has been validated and is **Production Ready**. Follow these exact steps to go live.

## 1. Prepare for GitHub
Run these commands in your terminal to push your project:
```bash
git init
git add .
git commit -m "ScholarPath Cloud Production Build"
# Create a new repo on github.com and then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 2. Deploy Frontend (Vercel)
1.  Sign in to [Vercel.com](https://vercel.com).
2.  Select **Add New Project** and pick your GitHub repo.
3.  **Environment Variables**: Add these in the Vercel dashboard:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4.  Click **Deploy**.

## 3. Finalize Database (Supabase)
Ensure your production database has the final schema by running the **SQL Editor** in Supabase with these files:
1. `supabase/schema.sql` (Tables)
2. `supabase/rls_fix.sql` (Security & Fixes)

## 4. Auth & Storage Settings
- **Auth**: Update `Authentication -> URL Configuration -> Site URL` to your new `.vercel.app` address.
- **Storage**: Ensure a private bucket named `documents` exists in `Storage`.

---
**Build Status**: ✅ Success (Next.js 16.2.0)
**Last Build Check**: April 10, 2026
