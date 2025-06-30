import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Case {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  language: string;
  method: 'record' | 'upload';
  status: 'pending' | 'processing' | 'completed';
  createdAt: Date;
  audioData?: Blob;
  transcription?: string;
  document?: string;
}

interface CaseContextType {
  cases: Case[];
  createCase: (caseData: Omit<Case, 'id' | 'status' | 'createdAt'>) => string;
  updateCaseStatus: (id: string, status: Case['status']) => void;
  getCaseById: (id: string) => Case | undefined;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};

interface CaseProviderProps {
  children: ReactNode;
}

export const CaseProvider: React.FC<CaseProviderProps> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);

  const createCase = (caseData: Omit<Case, 'id' | 'status' | 'createdAt'>): string => {
    const newCase: Case = {
      ...caseData,
      id: generateCaseId(),
      status: 'processing',
      createdAt: new Date(),
    };

    setCases(prev => [...prev, newCase]);
    return newCase.id;
  };

  const updateCaseStatus = (id: string, status: Case['status']) => {
    setCases(prev => prev.map(case_ => 
      case_.id === id ? { ...case_, status } : case_
    ));
  };

  const getCaseById = (id: string): Case | undefined => {
    return cases.find(case_ => case_.id === id);
  };

  const generateCaseId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `CASE-${timestamp}-${randomStr}`.toUpperCase();
  };

  return (
    <CaseContext.Provider value={{
      cases,
      createCase,
      updateCaseStatus,
      getCaseById,
    }}>
      {children}
    </CaseContext.Provider>
  );
};