// src/context/MonopolyBoardContext.tsx
'use client';

import type { GeneratePropertiesOutput } from '@/ai/flows/generate-properties';
import * as React from 'react';

interface MonopolyBoardContextType {
  boardData: GeneratePropertiesOutput | null;
  theme: string | null;
  setBoard: (data: GeneratePropertiesOutput | null, theme: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const MonopolyBoardContext = React.createContext<MonopolyBoardContextType | undefined>(undefined);

export const MonopolyBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boardData, setBoardDataState] = React.useState<GeneratePropertiesOutput | null>(null);
  const [theme, setThemeState] = React.useState<string | null>(null);
  const [isLoading, setIsLoadingState] = React.useState<boolean>(false);
  const [error, setErrorState] = React.useState<string | null>(null);

  const setBoard = (data: GeneratePropertiesOutput | null, newTheme: string | null) => {
    setBoardDataState(data);
    setThemeState(newTheme);
  };

  const setIsLoading = (loading: boolean) => {
    setIsLoadingState(loading);
  };

  const setError = (errorMsg: string | null) => {
    setErrorState(errorMsg);
  };

  return (
    <MonopolyBoardContext.Provider value={{ boardData, theme, setBoard, isLoading, setIsLoading, error, setError }}>
      {children}
    </MonopolyBoardContext.Provider>
  );
};

export const useMonopolyBoard = () => {
  const context = React.useContext(MonopolyBoardContext);
  if (context === undefined) {
    throw new Error('useMonopolyBoard must be used within a MonopolyBoardProvider');
  }
  return context;
};
