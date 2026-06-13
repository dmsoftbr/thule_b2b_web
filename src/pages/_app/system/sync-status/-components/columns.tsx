import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/number-utils";
import { formatDate } from "date-fns";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";

// LastSyncResult vazio = o integrador zerou o registro no início da carga e
// ainda não gravou o resultado final, ou seja, sincronização em andamento.
const renderResult = (result: string | null | undefined) => {
  const value = (result ?? "").trim().toUpperCase();

  if (value === "") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1.5">
        <Loader2Icon className="size-3 animate-spin" />
        Em andamento
      </Badge>
    );
  }
  if (value === "OK") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        OK
      </Badge>
    );
  }
  if (value === "EMPTY") {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
        Sem registros
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{value}</Badge>
  );
};

export const columns = (
  onSync: (item: any) => void,
  isRequesting: boolean,
): ServerTableColumn[] => [
  {
    title: "Item",
    dataIndex: "tableName",
    key: "tableName",
    sortable: false,
    renderItem: (item: any) => {
      return (
        <span className="text-blue-600 font-semibold">{item.tableName}</span>
      );
    },
  },
  {
    title: "Última Sincronização",
    dataIndex: "lastSync",
    key: "lastSync",
    sortable: false,
    renderItem: (item: any) => {
      return (
        <span>
          {item.lastSync
            ? formatDate(item.lastSync, "dd/MM/yyyy HH:mm:ss")
            : "-"}
        </span>
      );
    },
  },
  {
    title: "Resultado",
    dataIndex: "lastSyncResult",
    key: "lastSyncResult",
    sortable: true,
    renderItem: (item: any) => renderResult(item.lastSyncResult),
  },
  {
    title: "Tempo de Resposta API (segundos)",
    dataIndex: "responseTime",
    key: "responseTime",
    sortable: true,
    renderItem: (item: any) => (
      <span>{formatNumber(item.responseTime ?? 0, 1)}</span>
    ),
  },
  {
    title: "Tempo de Sincronização (segundos)",
    dataIndex: "syncTime",
    key: "syncTime",
    sortable: true,
    renderItem: (item: any) => <span>{formatNumber(item.syncTime ?? 0, 1)}</span>,
  },
  {
    title: "Detalhe do Erro",
    dataIndex: "error",
    key: "error",
    sortable: true,
    renderItem: (item: any) => (
      // O integrador grava mensagem + stack trace inteiros; sem o clamp a
      // linha da tabela explode de altura.
      <span
        className="block max-w-md truncate text-red-600"
        title={item.error || undefined}
      >
        {item.error || "-"}
      </span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
    sortable: false,
    renderItem: (item: any) => (
      <Button
        variant="outline"
        size="sm"
        disabled={isRequesting}
        onClick={() => onSync(item)}
      >
        <RefreshCwIcon className="size-3.5" />
        Sincronizar
      </Button>
    ),
  },
];
