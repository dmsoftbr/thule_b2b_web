import type { SessionModel } from "@/models/auth/session-model";
import axios from "axios";

export const API_URL = (window as any).__APP_CONFIG__.API_URL;

const getToken = (refreshToken: boolean) => {
  const localSession = localStorage.getItem("b2b@session");
  if (localSession) {
    const session: SessionModel = JSON.parse(localSession);
    if (session) {
      if (refreshToken) return session.refreshToken;
      return session.token;
    }
  }
};

const getSession = () => {
  const localSession = localStorage.getItem("b2b@session");
  if (localSession) {
    const session: SessionModel = JSON.parse(localSession);
    return session;
  }
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Adiciona o token JWT (Bearer) em cada requisição, se existir
api.interceptors.request.use((config) => {
  const token = getToken(false);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com refresh token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Evita loop infinito
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getToken(true);
        const token = getToken(false);
        if (!refreshToken) throw error;

        // Troque a URL abaixo para o endpoint correto do seu backend
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken, token }
        );
        const session = getSession();
        if (session) {
          console.log(data.token);
          //session.token = data.token;
          //localStorage.setItem("b2b@session", JSON.stringify(session));
        }

        // Atualiza o header e repete a requisição original
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("vou remover");
        // Opcional: logout ou redirecionamento
        //localStorage.removeItem("b2b@session");

        //window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api };
