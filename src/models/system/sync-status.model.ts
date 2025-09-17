export type SyncStatusModel = {
  tableName: string;
  lastSync: Date | null;
  error: string;
  responseTime: number;
  syncTime: number;
  lastSyncResult: string;
};
