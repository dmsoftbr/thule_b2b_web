import type { SessionModel } from "@/models/auth/session-model";
import axios from "axios";
import eventBus from "./event-bus";

export const API_URL = (window as any).__APP_CONFIG__.API_URL;

const getSession = (): SessionModel | null => {
  const localSession = localStorage.getItem("b2b@session");
  if (localSession) {
    return JSON.parse(localSession) as SessionModel;
  }
  return null;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Adiciona o token JWT (Bearer) em cada requisição, se existir
api.interceptors.request.use((config) => {
  const session = getSession();
  config.headers = config.headers || {};
  config.headers["waftoken"] = "B5557774-329D-46DD-A265-C3ABECA8B449";

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Interceptor para lidar com refresh token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const session = getSession();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      session?.refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post<{
          token: string;
          refreshToken: string;
        }>(`${API_URL}/auth/refresh-token`, {
          token: session.token,
          refreshToken: session.refreshToken,
        });

        // Atualiza a sessão com os novos tokens
        const newSession: SessionModel = {
          ...session,
          token: data.token,
          refreshToken: data.refreshToken,
        };
        localStorage.setItem("b2b@session", JSON.stringify(newSession));

        // Dispara o evento para que o AuthContext possa atualizar o estado
        eventBus.dispatch("sessionRefreshed", newSession);

        // Atualiza o header da requisição original e a repete
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh token falhar, limpa a sessão e redireciona para o login
        localStorage.removeItem("b2b@session");
        eventBus.dispatch("logout");
        window.location.href = "/b2b/auth/login"; // Use o basepath correto
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api };

export function handleError(error: any): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      if (typeof data === "string") return data;
      if (data.message) return data.message;
      // ProblemDetails do ASP.NET: agrega os erros de validação, se houver,
      // senão usa o título. Nunca retorna o objeto cru (que quebraria o
      // toast ao tentar renderizar um objeto como filho React).
      if (data.errors && typeof data.errors === "object") {
        const msgs = Object.values(data.errors as Record<string, unknown>)
          .flat()
          .filter((m): m is string => typeof m === "string");
        if (msgs.length > 0) return msgs.join(" ");
      }
      if (data.title) return data.title;
    }
    return error.message;
  }
  return error?.message ?? "Erro inesperado";
}
