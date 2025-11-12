import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";
import { PaymentConditionsService } from "@/services/registrations/payment-conditions.service";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/registrations/payment-conditions/")(
  {
    component: PaymentConditionsComponent,
  }
);

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "name",
    label: "Descrição",
  },
];
function PaymentConditionsComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState<PaymentConditionModel | null>(
    null
  );
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleEdit = (data: PaymentConditionModel) => {
    navigate({ to: `/registrations/payment-conditions/${data.id}` });
  };

  const handleDelete = async (data: PaymentConditionModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir esta Condição de Pagamento?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        {
          text: "Cancelar",
          variant: "secondary",
          value: "",
          autoClose: true,
        },
      ],
    });

    if (continueDelete) {
      await PaymentConditionsService.delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  const handleConfig = (data: PaymentConditionModel) => {
    setCurrentData(data);
    setShowModal(true);
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Condições de Pagamento">
      <div className="p-2">
        <ServerTable<PaymentConditionModel>
          key={tableToken}
          defaultSearchField="id"
          rowCss={(row) => (row.isActive ? "" : "!bg-red-100 line-through")}
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
            fnConfig: handleConfig,
          })}
          showAddButton={false}
          dataUrl="/registrations/payment-conditions/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
