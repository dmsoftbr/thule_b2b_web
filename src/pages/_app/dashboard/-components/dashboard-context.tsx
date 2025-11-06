import { createContext, useContext, useState, type ReactNode } from "react";

interface DashboardContextData {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}

interface DashboardProviderProps {
  children: ReactNode;
}

const DashboardContext = createContext<DashboardContextData>(
  {} as DashboardContextData
);

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  return (
    <DashboardContext.Provider value={{ year, setYear, month, setMonth }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextData {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  return context;
}
