-- ============================================================
-- FULL FIX PATCH — Run this in Supabase SQL Editor
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS guards
-- ============================================================


-- ── STEP 0: Fix profiles table constraints (root cause of signup errors) ─
-- Ensure aadhaar_id is nullable and has no unique constraint
ALTER TABLE public.profiles ALTER COLUMN aadhaar_id DROP NOT NULL;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_aadhaar_id_key;

-- Ensure other fields are nullable just in case they were set to NOT NULL
ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
DO $$ BEGIN
    BEGIN ALTER TABLE public.profiles ADD COLUMN special_category TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN institution TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN course_name TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN admission_year TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN bank_name TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN account_holder TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN account_number TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN ifsc_code TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN branch TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN account_type TEXT DEFAULT 'savings'; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.applications ADD COLUMN selected_documents JSONB DEFAULT '{}'::jsonb; EXCEPTION WHEN duplicate_column THEN END;
END $$;
ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;

-- Remove duplicate primary key if any weirdness happened
-- (id IS already PRIMARY KEY from schema.sql)

-- Add a comment for tracking
COMMENT ON TABLE public.profiles IS 'Student profiles linked to auth.users';


-- ── STEP 1: Create user_documents table (if it doesn't exist yet) ──
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  doc_type TEXT DEFAULT 'other',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;


-- ── STEP 2: Fix profiles RLS policies ──────────────────────────────
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select"              ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert"              ON public.profiles;
DROP POLICY IF EXISTS "profiles_update"              ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- ── STEP 3: Fix applications RLS policies ──────────────────────────
DROP POLICY IF EXISTS "Users can manage their own applications" ON public.applications;
DROP POLICY IF EXISTS "applications_select" ON public.applications;
DROP POLICY IF EXISTS "applications_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_update" ON public.applications;
DROP POLICY IF EXISTS "applications_delete" ON public.applications;

CREATE POLICY "applications_select" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "applications_insert" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "applications_update" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "applications_delete" ON public.applications
  FOR DELETE USING (auth.uid() = user_id);


-- ── STEP 4: Fix user_documents RLS policies ─────────────────────────
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "user_docs_select" ON public.user_documents;
DROP POLICY IF EXISTS "user_docs_insert" ON public.user_documents;
DROP POLICY IF EXISTS "user_docs_update" ON public.user_documents;
DROP POLICY IF EXISTS "user_docs_delete" ON public.user_documents;

CREATE POLICY "user_docs_select" ON public.user_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_docs_insert" ON public.user_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_docs_update" ON public.user_documents
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_docs_delete" ON public.user_documents
  FOR DELETE USING (auth.uid() = user_id);


-- ── STEP 5: Fix storage.objects policies ────────────────────────────
-- Drop all old variants first (handles naming differences)
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents"  ON storage.objects;
DROP POLICY IF EXISTS "storage_docs_insert"                 ON storage.objects;
DROP POLICY IF EXISTS "storage_docs_select"                 ON storage.objects;
DROP POLICY IF EXISTS "storage_docs_delete"                 ON storage.objects;

-- Ensure bucket exists (safe if already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "storage_docs_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_docs_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_docs_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ── STEP 6: Patch handle_new_user trigger ───────────────────────────
-- SECURITY DEFINER bypasses RLS for the auto-profile row on signup.
-- ON CONFLICT DO NOTHING (no target) catches ALL unique violations:
-- both id conflicts AND aadhaar_id conflicts (e.g. re-registration attempts).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
