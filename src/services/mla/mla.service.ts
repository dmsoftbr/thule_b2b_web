import { api } from "@/lib/api";
import { getDatasulCreds } from "@/lib/datasul-session";
import type {
  MlaPendencia,
  MlaTipoDocumento,
  MlaAprovacaoResult,
} from "@/models/mla/mla-models";

// As credenciais Datasul vivem só em memória (datasul-session) e são anexadas a cada
// chamada. A API as repassa ao Datasul; o b2b não as persiste.
function creds() {
  const c = getDatasulCreds();
  return { usuario: c?.usuario ?? "", senha: c?.senha ?? "" };
}

export class MlaService {
  private static basePath = "mla";

  // Valida as credenciais Datasul (gate). Lança em caso de erro (401/erro).
  static async login(usuario: string, senha: string): Promise<void> {
    await api.post(`/${this.basePath}/login`, { usuario, senha });
  }

  static async listTipos(): Promise<MlaTipoDocumento[]> {
    const { data } = await api.post<MlaTipoDocumento[]>(
      `/${this.basePath}/tipos-documento`,
      {}
    );
    return data;
  }

  static async listPendencias(
    busca: string,
    tipos: number[]
  ): Promise<MlaPendencia[]> {
    const { data } = await api.post<MlaPendencia[]>(
      `/${this.basePath}/pendencias`,
      { busca, tipos, ...creds() }
    );
    return data;
  }

  static async aprovar(
    nrTransacoes: number[],
    narrativa: string
  ): Promise<MlaAprovacaoResult> {
    const { data } = await api.post<MlaAprovacaoResult>(
      `/${this.basePath}/aprovar`,
      { nrTransacoes, narrativa, ...creds() }
    );
    return data;
  }

  static async reprovar(
    nrTransacoes: number[],
    narrativa: string
  ): Promise<MlaAprovacaoResult> {
    const { data } = await api.post<MlaAprovacaoResult>(
      `/${this.basePath}/reprovar`,
      { nrTransacoes, narrativa, ...creds() }
    );
    return data;
  }
}
