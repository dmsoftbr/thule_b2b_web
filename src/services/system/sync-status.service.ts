import { api } from "@/lib/api";

import type { SyncStatusModel } from "@/models/system/sync-status.model";

export class SyncStatusService {
  private static basePath: string = "system/sync-status";

  static async get(): Promise<SyncStatusModel[]> {
    const response = await api.get<SyncStatusModel[]>(`/${this.basePath}`);
    return response.data;
  }

  /**
   * Enfileira uma sincronização sob demanda (executada pelo Integrador).
   * domain: nome exibido na tela ("Clientes"), chave do registry ou "ALL".
   * Período (yyyy-MM-dd) é opcional — hoje só o Profitability usa.
   */
  static async requestSync(
    domain: string,
    initDate?: string,
    endDate?: string,
  ): Promise<void> {
    await api.post(`/${this.basePath}/run`, { domain, initDate, endDate });
  }
}
