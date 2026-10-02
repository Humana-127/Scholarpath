-- Run this in the Supabase SQL Editor to fix the saving issues

-- 1. Fix Profile Saving (We need to allow INSERT because of UPSERT operations)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Fix Document Uploading (Relaxing the path restriction so any logged in user can save to the bucket)
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
CREATE POLICY "Users can upload their own documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Also allow them to update existing files if they re-upload
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
CREATE POLICY "Users can update their own documents" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
