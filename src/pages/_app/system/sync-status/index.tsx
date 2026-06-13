import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/api";
import { SyncStatusService } from "@/services/system/sync-status.service";
import { createFileRoute } from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./-components/columns";
import { ProfitabilitySyncDialog } from "./-components/profitability-sync-dialog";
import { formatDate } from "date-fns";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/system/sync-status/")({
  component: SyncStatusComponent,
  pendingComponent: TableSkeleton,
});

const REFRESH_INTERVAL_MS = 15_000;

function SyncStatusComponent() {
  const [isRequesting, setIsRequesting] = useState(false);
  const [profitabilityDialogOpen, setProfitabilityDialogOpen] = useState(false);
  const [syncAllDialogOpen, setSyncAllDialogOpen] = useState(false);

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["sync-status"],
    // Auto-refresh para acompanhar cargas em andamento (ex.: backfill do
    // Profitability) sem precisar recarregar a página.
    refetchInterval: REFRESH_INTERVAL_MS,
    queryFn: async () => {
      // Erro tratado aqui (e não via estado de erro da query) para evitar
      // os retries padrão do React Query disparando vários toasts.
      try {
        return await SyncStatusService.get();
      } catch (error) {
        toast.error(handleError(error));
        return [];
      }
    },
  });

  const requestSync = async (
    domain: string,
    initDate?: Date,
    endDate?: Date,
  ) => {
    setIsRequesting(true);
    try {
      await SyncStatusService.requestSync(
        domain,
        initDate ? formatDate(initDate, "yyyy-MM-dd") : undefined,
        endDate ? formatDate(endDate, "yyyy-MM-dd") : undefined,
      );
      toast.success(
        `Sincronização solicitada${domain === "ALL" ? "" : `: ${domain}`}. Acompanhe o resultado nesta tela.`,
      );
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSyncItem = (item: any) => {
    // Profitability é refresh por janela de datas — pede o período antes.
    if (item.tableName === "Profitability") {
      setProfitabilityDialogOpen(true);
      return;
    }
    requestSync(item.tableName);
  };

  return (
    <AppPageHeader titleSlot="Sincronização do Sistema">
      <div className="mt-4 px-2 pb-4 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="blue"
            disabled={isRequesting}
            onClick={() => setSyncAllDialogOpen(true)}
          >
            <RefreshCwIcon className="size-4" />
            Sincronizar Tudo
          </Button>
          <p className="text-xs text-muted-foreground">
            Atualiza automaticamente a cada {REFRESH_INTERVAL_MS / 1000}s
            {dataUpdatedAt
              ? ` — última atualização às ${formatDate(dataUpdatedAt, "HH:mm:ss")}`
              : ""}
          </p>
        </div>
        <ServerTable<any>
          columns={columns(handleSyncItem, isRequesting)}
          dataUrl={""}
          items={data}
          isPending={isLoading}
          defaultPageSize={0}
          showAddButton={false}
          defaultSearchField="tableName"
          searchFields={[
            {
              id: "tableName",
              label: "Item",
            },
          ]}
        ></ServerTable>
      </div>

      <ProfitabilitySyncDialog
        open={profitabilityDialogOpen}
        onOpenChange={setProfitabilityDialogOpen}
        onConfirm={(initDate, endDate) =>
          requestSync("Profitability", initDate, endDate)
        }
      />

      <AlertDialog open={syncAllDialogOpen} onOpenChange={setSyncAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sincronizar tudo?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os itens serão sincronizados com o ERP, em ordem de
              dependência. O processo pode levar vários minutos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => requestSync("ALL")}>
              Sincronizar Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppPageHeader>
  );
}
