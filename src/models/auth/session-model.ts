// A sessão persistida em memória contém apenas o PERFIL do usuário. O access token
// vive numa variável de módulo em `lib/api.ts` (nunca em localStorage) e o refresh
// token fica num cookie HttpOnly inacessível ao JS — por isso não aparecem aqui.
export type SessionModel = {
  user: {
    id: string;
    email: string;
    name: string;
    role: number;
    representativeId: number;
    customerId?: string;
    networkDomain?: string;
  };
};

// Resposta do endpoint de login: perfil + access token (sem refresh, que vai no cookie).
export type LoginResponse = {
  user: SessionModel["user"];
  token: string;
};
