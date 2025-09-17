import { type SessionModel } from "@/models/auth/session-model";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextType {
  isPending: boolean;
  session: SessionModel | null;
  login: (userData: SessionModel) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionModel | null>(null);
  const [isPending, setIsPending] = useState(true);

  const login = (userData: SessionModel) => {
    setSession(userData);
    console.log("vou definir no login", userData);
    localStorage.setItem("b2b@session", JSON.stringify(userData));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("b2b@session");
  };

  useEffect(() => {
    const localTokenJson = localStorage.getItem("b2b@session");
    if (localTokenJson) {
      const localSession: SessionModel = JSON.parse(localTokenJson);
      if (localSession) setSession(localSession);
    }
    setIsPending(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isPending, session, login, logout, isAuthenticated: !!session }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
