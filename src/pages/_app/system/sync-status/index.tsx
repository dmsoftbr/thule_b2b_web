import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableColumn,
} from "@/components/server-table/server-table";
import type { SyncStatusModel } from "@/models/system/sync-status.model";
import { SyncStatusService } from "@/services/system/sync-status.service";
import { createFileRoute } from "@tanstack/react-router";
import { formatDate } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/system/sync-status/")({
  component: SyncStatusComponent,
});

function SyncStatusComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["sync-status"],
    queryFn: () => SyncStatusService.get(),
  });

  const tableData = useMemo(() => data ?? [], [data]);

  const columns: ServerTableColumn<SyncStatusModel>[] = [
    {
      dataKey: "tableName",
      id: "tableName",
      header: "Item",
      render: (row: SyncStatusModel) => (
        <div
          className={cn(
            "absolute inset-0 break-words whitespace-normal p-1",
            row.lastSyncResult != "OK" && "bg-red-200"
          )}
        >
          {row.tableName}
        </div>
      ),
    },
    {
      dataKey: "lastSync",
      id: "lastSync",
      header: "Última Sincronização",
      render: (row: SyncStatusModel) => (
        <div
          className={cn(
            "absolute inset-0 break-words whitespace-normal p-1",
            row.lastSyncResult != "OK" && "bg-red-200"
          )}
        >
          {row.lastSync ? formatDate(row.lastSync, "dd/MM/yyyy HH:mm:ss") : ""}
        </div>
      ),
    },
    {
      dataKey: "lastSyncResult",
      id: "lastSyncResult",
      header: "Resultado",
      render: (row: SyncStatusModel) => (
        <div
          className={cn(
            "absolute inset-0 break-words whitespace-normal p-1",
            row.lastSyncResult != "OK" && "bg-red-200"
          )}
        >
          {row.lastSyncResult}
        </div>
      ),
    },
    {
      dataKey: "responseTime",
      id: "responseTime",
      header: "Tempo de Resposta API (segundos)",
      render: (row: SyncStatusModel) => (
        <div
          className={cn(
            "absolute inset-0 break-words whitespace-normal p-1",
            row.lastSyncResult != "OK" && "bg-red-200"
          )}
        >
          {row.responseTime}
        </div>
      ),
    },
    {
      dataKey: "syncTime",
      id: "syncTime",
      header: "Tempo de Sincronização (segundos)",
      render: (row: SyncStatusModel) => (
        <div
          className={cn(
            "absolute inset-0 break-words whitespace-normal p-1",
            row.lastSyncResult != "OK" && "bg-red-200"
          )}
        >
          {row.syncTime}
        </div>
      ),
    },
    {
      dataKey: "error",
      id: "error",
      header: "Detalhe do Erro",
      render: (row: SyncStatusModel) => (
        <div
          className={cn(
            "absolute inset-0 break-words whitespace-normal p-1",
            row.lastSyncResult != "OK" && "bg-red-200"
          )}
        >
          {row.error}
        </div>
      ),
    },
  ];

  return (
    <AppPageHeader titleSlot="Sincronização do Sistema">
      <div className="mt-4 px-2 pb-4">
        <div>
          <Button
            size="icon"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["sync-status"] });
            }}
          >
            <RefreshCwIcon className="size-4" />
          </Button>
        </div>
        <ServerTable
          thClassName="text-sm"
          tdClassName="text-xs !h-10"
          columns={columns}
          pagination={{
            noPagination: true,
            defaultPageSize: 0,
            pageSizeOptions: [0],
          }}
          data={tableData}
          totalItems={tableData.length}
          loading={isLoading}
          keyExtractor={(item: SyncStatusModel) => item.tableName}
        />
      </div>
    </AppPageHeader>
  );
}
