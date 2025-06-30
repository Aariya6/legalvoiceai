import { useState, useEffect } from 'react';
import { LegalCase } from '../lib/supabase';

// Mock data for demonstration
const mockCases: LegalCase[] = [
  {
    id: 'CASE-2024-001',
    user_name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    category: 'Property Dispute',
    language: 'en',
    method: 'record',
    status: 'completed',
    audio_file_url: 'https://example.com/audio1.wav',
    transcription: 'I am writing to formally request the return of my security deposit in the amount of $1,200 from the rental property located at 123 Main Street. I vacated the premises on December 15th, 2023, and left the property in excellent condition.',
    generated_document: 'FORMAL DEMAND LETTER - SECURITY DEPOSIT RETURN...',
    document_url: 'https://example.com/document1.pdf',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:35:00Z',
    processing_steps: [
      {
        step: 'upload',
        status: 'completed',
        timestamp: '2024-01-15T10:30:00Z',
        message: 'Audio file uploaded successfully'
      },
      {
        step: 'transcription',
        status: 'completed',
        timestamp: '2024-01-15T10:32:00Z',
        message: 'Transcription completed with 94% confidence'
      },
      {
        step: 'generation',
        status: 'completed',
        timestamp: '2024-01-15T10:34:00Z',
        message: 'Legal document generated successfully'
      },
      {
        step: 'delivery',
        status: 'completed',
        timestamp: '2024-01-15T10:35:00Z',
        message: 'Document delivered via email'
      }
    ]
  },
  {
    id: 'CASE-2024-002',
    user_name: 'Michael Chen',
    email: 'michael.chen@email.com',
    category: 'Wage Theft',
    language: 'en',
    method: 'upload',
    status: 'completed',
    transcription: 'I am filing a complaint against my former employer for wage theft. They have failed to pay me for overtime hours worked during October and November 2023. The total amount owed is approximately $2,400.',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:28:00Z',
    processing_steps: []
  },
  {
    id: 'CASE-2024-003',
    user_name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    category: 'Loan Recovery',
    language: 'en',
    method: 'record',
    status: 'processing',
    created_at: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:15:00Z',
    processing_steps: []
  }
];

export function useLegalCases() {
  const [cases, setCases] = useState<LegalCase[]>(mockCases);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCase = async (caseData: {
    user_name: string;
    email: string;
    phone?: string;
    category: string;
    language: string;
    method: 'record' | 'upload';
  }, audioFile: File): Promise<string> => {
    try {
      setLoading(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCase: LegalCase = {
        id: `CASE-${Date.now()}`,
        user_name: caseData.user_name,
        email: caseData.email,
        phone: caseData.phone,
        category: caseData.category,
        language: caseData.language,
        method: caseData.method,
        status: 'processing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        processing_steps: [
          {
            step: 'upload',
            status: 'completed',
            timestamp: new Date().toISOString(),
            message: 'Audio file uploaded successfully'
          }
        ]
      };

      setCases(prev => [newCase, ...prev]);
      
      // Simulate processing workflow
      setTimeout(() => {
        setCases(prev => prev.map(case_ => 
          case_.id === newCase.id 
            ? { ...case_, status: 'transcribing' }
            : case_
        ));
      }, 2000);

      setTimeout(() => {
        setCases(prev => prev.map(case_ => 
          case_.id === newCase.id 
            ? { ...case_, status: 'generating', transcription: 'Mock transcription of the user\'s legal issue...' }
            : case_
        ));
      }, 5000);

      setTimeout(() => {
        setCases(prev => prev.map(case_ => 
          case_.id === newCase.id 
            ? { 
                ...case_, 
                status: 'completed',
                generated_document: 'Generated legal document content...',
                document_url: 'https://example.com/document.pdf'
              }
            : case_
        ));
      }, 8000);

      return newCase.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCaseById = (id: string): LegalCase | undefined => {
    return cases.find(case_ => case_.id === id);
  };

  const refetch = async () => {
    // In a real app, this would refetch from the server
    setLoading(false);
  };

  return {
    cases,
    loading,
    error,
    createCase,
    getCaseById,
    refetch
  };
}