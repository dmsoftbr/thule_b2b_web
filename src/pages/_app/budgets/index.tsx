import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { useState } from "react";
import { add } from "date-fns";
import type { OrderModel } from "@/models/orders/order-model";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Label } from "recharts";
import { DatePicker } from "@/components/ui/date-picker";
import { SearchCombo } from "@/components/ui/search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { Button } from "@/components/ui/button";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { columns } from "../orders/-components/columns";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "orderId",
    label: "Pedido",
  },
  {
    id: "customerAbbreviation",
    label: "Abrev. Cliente",
  },
  {
    id: "customerId",
    label: "Cód. Cliente",
  },
  {
    id: "representativeId",
    label: "Cód. Representante",
  },
  {
    id: "RepresentativeAbbreviation",
    label: "Abrev. Representante",
  },
  {
    id: "CustomerDocumentNumber",
    label: "CPF/CNPJ Cliente",
  },
  {
    id: "CustomerName",
    label: "Razão Social Cliente",
  },
];

export const Route = createFileRoute("/_app/budgets/")({
  component: BudgetsPage,
});

function BudgetsPage() {
  const navigate = useNavigate();
  const { showAppDialog } = useAppDialog();
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [createdAtFrom, setCreatedAtFrom] = useState<Date | undefined>(
    new Date(add(new Date(), { days: -30 }))
  );
  const [createdAtTo, setCreatedAtTo] = useState<Date | undefined>(new Date());
  const [selectedReps, setSelectedReps] = useState<number[]>([]);

  const handleAdd = () => {
    navigate({ to: "/budgets/new-budget" });
  };

  const handleEdit = (data: OrderModel) => {
    navigate({ to: `/budgets/edit/${data.id}` });
  };

  const handleView = (data: OrderModel) => {
    navigate({ to: `/budgets/view/${data.id}` });
  };

  const handleCancel = async (data: OrderModel) => {
    const continueDelete = await showAppDialog({
      message: "Cancelar esta Simulação?",
      title: "Atenção",
      type: "question",
      buttons: [
        { text: "Continuar", variant: "danger", autoClose: true, value: true },
        { text: "Fechar", variant: "secondary", autoClose: true, value: false },
      ],
    });

    if (continueDelete) {
      await api.delete(`/orders/${data.id}`);

      //await OrdersService
      setTableToken(new Date().valueOf());
    }
  };

  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: async () => {
      const { data } = await api.get("/registrations/representatives/all");
      return data;
    },
  });

  const handleApplyAdvancedFilter = () => {
    setTableToken(new Date().valueOf());
  };

  const renderAdvancedFilter = () => {
    return (
      <div className="mt-2 flex gap-x-2 flex-wrap bg-blue-100 p-2 rounded-md">
        <div>
          <div className="form-group">
            <Label>Período de Inclusão</Label>
            <div className="flex items-center gap-x-2">
              <DatePicker
                defaultValue={createdAtFrom}
                onValueChange={(date) => setCreatedAtFrom(date)}
              />{" "}
              a{" "}
              <DatePicker
                defaultValue={createdAtTo}
                onValueChange={(date) => setCreatedAtTo(date)}
              />
            </div>
          </div>
        </div>
        <div className="form-group flex-1">
          <Label>Representante</Label>
          <SearchCombo
            multipleSelect
            onChange={() => {}}
            onSelectOption={(values) =>
              setSelectedReps(values.map((item) => Number(item.value)))
            }
            staticItems={convertArrayToSearchComboItem(
              representativesData ?? [],
              "id",
              "abbreviation"
            )}
            showSelectButtons
          />
        </div>

        <div className="flex gap-x-2 mt-5">
          <Button
            onClick={() => {
              handleApplyAdvancedFilter();
            }}
          >
            Aplicar Filtro
          </Button>
          <Button
            onClick={() => {
              setTableToken(new Date().valueOf());
            }}
          >
            Limpar Filtro
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AppPageHeader titleSlot="Simulações">
      <div className="p-2">
        <ServerTable<OrderModel>
          key={tableToken}
          defaultSearchField="orderId"
          defaultSortFieldDataIndex="createdAt"
          defaultSortDesc
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnCancel: handleCancel,
            fnView: handleView,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/orders/list-paged"
          advancedFilterSlot={renderAdvancedFilter()}
          showAdvancedFilter
          additionalInfo={{
            statusIds: [],
            representativeIds: selectedReps,
            createdAtFrom:
              createdAtFrom ?? new Date(add(new Date(), { days: -30 })),
            createdAtTo: createdAtTo ?? new Date(),
            isBudget: true,
          }}
        />
      </div>
    </AppPageHeader>
  );
}
