import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { PriceExceptionTableModel } from "@/models/registrations/price-exception-table.model";
import { columns } from "./-components/columns";
import { useState } from "react";
import { PriceExceptionTablesService } from "@/services/registrations/price-exception-tables.service";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { handleError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_app/registrations/price-exception-tables/",
)({
  component: PriceExceptionTablesPageComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  { id: "id", label: "Código" },
  { id: "name", label: "Nome" },
];

function PriceExceptionTablesPageComponent() {
  const { showAppDialog } = useAppDialog();
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: "/registrations/price-exception-tables/new-table" });
  };

  const handleConfigure = (data: PriceExceptionTableModel) => {
    navigate({ to: `/registrations/price-exception-tables/${data.id}` });
  };

  const handleDelete = async (data: PriceExceptionTableModel) => {
    const continueDelete = await showAppDialog({
      title: "Atenção",
      message:
        "Ao excluir este grupo de desconto, as regras (margens/estabelecimentos) e o vínculo com clientes também serão eliminados. Continua?",
      type: "confirm",
      buttons: [
        { text: "Excluir", value: true, variant: "danger" },
        { text: "Cancelar", value: false, variant: "secondary" },
      ],
    });

    if (continueDelete) {
      try {
        await PriceExceptionTablesService.delete(data.id);
        setTableToken(new Date().valueOf());
      } catch (error) {
        toast.error(handleError(error));
      }
    }
  };

  return (
    <AppPageHeader titleSlot="Grupos de Desconto">
      <div className="p-2">
        <ServerTable<PriceExceptionTableModel>
          key={tableToken}
          onAdd={() => handleAdd()}
          defaultSearchField="name"
          defaultSortFieldDataIndex="name"
          searchFields={searchFieldsList}
          columns={columns({
            fnConfigure: handleConfigure,
            fnDelete: handleDelete,
          })}
          dataUrl="/registrations/price-exception-tables/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
