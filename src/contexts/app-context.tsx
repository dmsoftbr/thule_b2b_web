import { createContext, useContext, type ReactNode } from "react";

// Defina o tipo do valor que será compartilhado no contexto
interface AppContextType {}

// Crie o contexto com valor padrão
const AppContext = createContext<AppContextType | undefined>(undefined);

// Crie um componente Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

// Crie um hook para usar facilmente o contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um AppProvider");
  }
  return context;
};

// Exporta o contexto caso queira usar diretamente como <AppContext.Provider>
export default AppContext;
