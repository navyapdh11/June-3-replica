import React, { createContext, useContext, useState, ReactNode } from "react";
import { QuoteRequest, Cleaner } from "../types";

interface CleanersContextProps {
  quotes: QuoteRequest[];
  cleaners: Cleaner[];
  activeCleanerName: string;
  setActiveCleanerName: (name: string) => void;
  daylightHighContrast: boolean;
  setDaylightHighContrast: (val: boolean) => void;
  onUpdateQuote: (updated: QuoteRequest) => void;
  onTriggerLog: (log: any) => void;
}

const CleanersContext = createContext<CleanersContextProps | undefined>(undefined);

export const CleanersProvider: React.FC<{ 
  children: ReactNode; 
  quotes: QuoteRequest[]; 
  cleaners: Cleaner[]; 
  onUpdateQuote: (updated: QuoteRequest) => void;
  onTriggerLog: (log: any) => void;
}> = ({ children, quotes, cleaners, onUpdateQuote, onTriggerLog }) => {
  const [activeCleanerName, setActiveCleanerName] = useState(cleaners[0]?.name || "");
  const [daylightHighContrast, setDaylightHighContrast] = useState(false);

  return (
    <CleanersContext.Provider value={{ 
      quotes, 
      cleaners, 
      activeCleanerName, 
      setActiveCleanerName, 
      daylightHighContrast, 
      setDaylightHighContrast,
      onUpdateQuote,
      onTriggerLog 
    }}>
      {children}
    </CleanersContext.Provider>
  );
};

export const useCleaners = () => {
  const context = useContext(CleanersContext);
  if (!context) throw new Error("useCleaners must be used within a CleanersProvider");
  return context;
};
