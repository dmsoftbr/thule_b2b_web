import axios from "axios";
import eventBus from "./event-bus";

const APP_CONFIG = (window as any).__APP_CONFIG__ ?? {};
export const API_URL = APP_CONFIG.API_URL;

// Token de bypass do Azure WAF. O WAF (na borda) exige este header para a request
// chegar ao servidor, então o frontend PRECISA enviá-lo. Como qualquer valor enviado
// pelo browser é tecnicamente extraível, aqui ele fica apenas OFUSCADO (XOR+base64),
// não em texto plano — barra a coleta trivial via grep no bundle/config.js, sem a
// pretensão de ser segredo real. Pode ser sobrescrito por runtime config no deploy.
const _k = ["x9$Th", "!2bW", "zR#7pQ"].join("");
const _b = "OgwRYV8WBVZ6SWAac11lTn1geSkTBFd6OWFidTUSOQFmYFwY";
function _deobf(blob: string, key: string): string {
  const bytes =
    typeof atob === "function"
      ? Uint8Array.from(atob(blob), (c) => c.charCodeAt(0))
      : new Uint8Array();
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += String.fromCharCode(bytes[i] ^ key.charCodeAt(i % key.length));
  }
  return out;
}
const WAF_TOKEN: string | undefined = APP_CONFIG.WAF_TOKEN || _deobf(_b, _k);

// O access token vive APENAS em memória (variável de módulo). Some no reload da
// página — a sessão é reidratada via refresh silencioso (cookie HttpOnly) no bootstrap.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: API_URL,
  // Envia o cookie HttpOnly de refresh nas chamadas de auth (same-origin em dev via
  // proxy do Vite; same-domain em produção).
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  // Header custom: defesa anti-CSRF exigida pelos endpoints de auth baseados em cookie.
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  if (WAF_TOKEN) config.headers["waftoken"] = WAF_TOKEN;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Singleton de refresh: várias requisições que tomam 401 ao mesmo tempo compartilham
// uma única chamada a /auth/refresh-token (evita "stampede" de refreshes concorrentes).
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ token: string }>(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            ...(WAF_TOKEN ? { waftoken: WAF_TOKEN } : {}),
          },
        }
      )
      .then((res) => {
        const token = res.data.token;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Não tenta refresh para a própria chamada de refresh/login (evita laço).
    const url: string = originalRequest?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/refresh-token") || url.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou (cookie ausente/expirado) → sessão encerrada.
        setAccessToken(null);
        eventBus.dispatch("logout");
        window.location.href = "/b2b/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api, refreshAccessToken };

const DB_CONNECTION_ERROR_MESSAGE = "Erro de Comunicação com o Banco de Dados";

// Mensagens cruas do MySqlConnector quando o banco está inacessível. Muitos
// controllers da API capturam Exception e devolvem ex.Message direto (400),
// então a tradução precisa acontecer aqui também — o middleware da API
// (DatabaseExceptionMiddleware, 503) cobre só as exceções não capturadas.
const MYSQL_CONNECTION_ERROR_PATTERNS = [
  /unable to connect to any of the specified mysql hosts/i,
  /connect timeout expired/i,
];

function translateDbConnectionError(message: string): string {
  return MYSQL_CONNECTION_ERROR_PATTERNS.some((p) => p.test(message))
    ? DB_CONNECTION_ERROR_MESSAGE
    : message;
}

export function handleError(error: any): string {
  return translateDbConnectionError(extractErrorMessage(error));
}

function extractErrorMessage(error: any): string {
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
