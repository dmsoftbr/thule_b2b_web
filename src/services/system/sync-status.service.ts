import { api } from "@/lib/api";

import type { SyncStatusModel } from "@/models/system/sync-status.model";

export class SyncStatusService {
  private static basePath: string = "system/sync-status";

  static async get(): Promise<SyncStatusModel[]> {
    const response = await api.get<SyncStatusModel[]>(`/${this.basePath}`);
    return response.data;
  }
}
