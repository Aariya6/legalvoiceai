import { createClient } from '@supabase/supabase-js';

// For demo purposes, we'll use mock data instead of real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_key_12345';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LegalCase {
  id: string;
  user_name: string;
  email: string;
  phone?: string;
  category: string;
  language: string;
  method: 'record' | 'upload';
  status: 'pending' | 'processing' | 'transcribing' | 'generating' | 'completed' | 'failed';
  audio_file_url?: string;
  transcription?: string;
  generated_document?: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
  processing_steps: ProcessingStep[];
}

export interface ProcessingStep {
  step: string;
  status: 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  message: string;
}

export interface DocumentTemplate {
  id: string;
  category: string;
  language: string;
  template_name: string;
  template_content: string;
  created_at: string;
  updated_at: string;
}