import { type SessionModel } from "@/models/auth/session-model";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import eventBus from "@/lib/event-bus";
import { useQueryClient } from "@tanstack/react-query";
import {
  api,
  refreshAccessToken,
  setAccessToken,
} from "@/lib/api";

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
  const queryClient = useQueryClient();

  // O access token já foi guardado em memória (setAccessToken) pelo fluxo de login;
  // aqui só persistimos o perfil no estado do contexto.
  const login = (userData: SessionModel) => {
    setSession(userData);
    queryClient.invalidateQueries({ queryKey: ["permissions"] });
  };

  const logout = () => {
    // Revoga o refresh no servidor e limpa o cookie. Mantém o access token em memória
    // até a requisição partir (o interceptor anexa o Bearer) e só então o zera — evita
    // um refresh desnecessário logo antes de revogar. Falha de rede não impede o logout
    // local: o estado é limpo de qualquer forma.
    api
      .post("/auth/logout")
      .catch(() => {})
      .finally(() => setAccessToken(null));
    setSession(null);
    queryClient.removeQueries({ queryKey: ["permissions"] });
  };

  useEffect(() => {
    let cancelled = false;

    // Bootstrap: a memória zera a cada reload. Tenta um refresh silencioso (cookie
    // HttpOnly) para reidratar a sessão; se ok, busca o perfil em /auth/me.
    const bootstrap = async () => {
      try {
        await refreshAccessToken();
        const { data } = await api.get<SessionModel["user"]>("/auth/me");
        if (!cancelled) setSession({ user: data });
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setSession(null);
        }
      } finally {
        if (!cancelled) setIsPending(false);
      }
    };

    bootstrap();

    // Logout global disparado pelo interceptor quando o refresh falha.
    const handleLogout = () => {
      setAccessToken(null);
      setSession(null);
    };

    eventBus.on("logout", handleLogout);
    return () => {
      cancelled = true;
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
