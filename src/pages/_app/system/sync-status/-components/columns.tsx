import type { ServerTableColumn } from "@/components/server-table/server-table";
import { formatDate } from "date-fns";

export const columns = (): ServerTableColumn[] => [
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
      return <span>{formatDate(item.lastSync, "dd/MM/yyyy HH:mm:ss")}</span>;
    },
  },
  {
    title: "Resultado",
    dataIndex: "lastSyncResult",
    key: "lastSyncResult",
    sortable: true,
  },
  {
    title: "Tempo de Resposta API (segundos)",
    dataIndex: "responseTime",
    key: "responseTime",
    sortable: true,
  },
  {
    title: "Tempo de Sincronização (segundos)",
    dataIndex: "syncTime",
    key: "syncTime",
    sortable: true,
  },
  {
    title: "Detalhe do Erro",
    dataIndex: "error",
    key: "error",
    sortable: true,
  },
];
