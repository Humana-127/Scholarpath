-- Run this in the Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  aadhaar_id TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  category TEXT,
  annual_income TEXT,
  education_level TEXT,
  stream TEXT,
  percentage NUMERIC(5,2),
  state TEXT,
  special_category TEXT,
  institution TEXT,
  course_name TEXT,
  admission_year TEXT,
  bank_name TEXT,
  account_holder TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  branch TEXT,
  account_type TEXT DEFAULT 'savings',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create Applications Table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scholarship_id TEXT NOT NULL,
  scholarship_name TEXT NOT NULL,
  organization TEXT,
  amount NUMERIC,
  deadline DATE,
  status TEXT DEFAULT 'draft',
  selected_documents JSONB DEFAULT '{}'::jsonb,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own applications" ON applications 
  FOR ALL USING (auth.uid() = user_id);

-- 3. Create Storage Buckets for Documents
-- (Note: you can also create this manually in the Supabase Dashboard -> Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Enable RLS for the storage bucket
CREATE POLICY "Users can upload their own documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger to auto-create profile row when a new Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, aadhaar_id)
  VALUES (new.id, new.raw_user_meta_data->>'aadhaar_id');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Create User Documents Table
CREATE TABLE public.user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  doc_type TEXT DEFAULT 'other',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for user documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents" ON user_documents 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
