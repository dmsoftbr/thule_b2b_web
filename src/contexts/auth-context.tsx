import { type SessionModel } from "@/models/auth/session-model";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import eventBus from "@/lib/event-bus";

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
    localStorage.setItem("b2b@session", JSON.stringify(userData));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("b2b@session");
  };

  useEffect(() => {
    // Carrega a sessão inicial do localStorage
    const localSessionJson = localStorage.getItem("b2b@session");
    if (localSessionJson) {
      try {
        const localSession = JSON.parse(localSessionJson);
        setSession(localSession);
      } catch (error) {
        console.error("Failed to parse session from localStorage", error);
        localStorage.removeItem("b2b@session");
      }
    }
    setIsPending(false);

    // Listener para quando o token for atualizado pelo interceptor
    const handleSessionRefreshed = (newSession: SessionModel) => {
      setSession(newSession);
    };

    // Listener para quando o refresh token falhar
    const handleLogout = () => {
      setSession(null);
    };

    eventBus.on("sessionRefreshed", handleSessionRefreshed);
    eventBus.on("logout", handleLogout);

    return () => {
      eventBus.remove("sessionRefreshed", handleSessionRefreshed);
      eventBus.remove("logout", handleLogout);
    };
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