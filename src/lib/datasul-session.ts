// Credenciais Datasul do aprovador para o módulo MLA. Mantidas APENAS em memória
// (nunca em localStorage), no espírito do access token em `lib/api.ts`. Some no reload
// da página — o usuário reconecta pelo gate. Nunca persistir nem logar a senha.
type DatasulCreds = { usuario: string; senha: string };

let creds: DatasulCreds | null = null;

export const setDatasulCreds = (usuario: string, senha: string) => {
  creds = { usuario, senha };
};

export const getDatasulCreds = (): DatasulCreds | null => creds;

export const hasDatasulCreds = (): boolean => !!creds;

export const clearDatasulCreds = () => {
  creds = null;
};
