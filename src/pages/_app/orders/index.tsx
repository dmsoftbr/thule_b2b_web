import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import { useState } from "react";
import { columns } from "./-components/columns";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import type { OrderModel } from "@/models/orders/order-model";
import { Label } from "@/components/ui/label";
import { SearchCombo } from "@/components/ui/search-combo";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
];

export const Route = createFileRoute("/_app/orders/")({
  component: ListOrdersPage,
});

function ListOrdersPage() {
  const navigate = useNavigate();
  const { showAppDialog } = useAppDialog();
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [createdAtFrom, setCreatedAtFrom] = useState<Date | undefined>(
    undefined
  );
  const [createdAtTo, setCreatedAtTo] = useState<Date | undefined>(undefined);
  const [selectedReps, setSelectedReps] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number[]>([]);
  const [customWhere, setCustomWhere] = useState("");
  const handleAdd = () => {
    navigate({ to: "/orders/new-order" });
  };

  const handleEdit = (data: OrderModel) => {
    navigate({ to: `/orders/edit/${data.id}` });
  };

  const handleView = (data: OrderModel) => {
    navigate({ to: `/orders/view/${data.id}` });
  };

  const handleCancel = async (data: OrderModel) => {
    const continueDelete = await showAppDialog({
      message: "Cancelar este Pedido?",
      title: "Atenção",
      type: "question",
      buttons: [
        { text: "Continuar", variant: "danger", autoClose: true, value: true },
        { text: "Fechar", variant: "secondary", autoClose: true, value: false },
      ],
    });

    if (continueDelete) {
      console.log(data);
      console.log(selectedReps, selectedStatus, customWhere);
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
        <div className="form-group flex-1">
          <Label>Situação do Pedido</Label>
          <SearchCombo
            multipleSelect
            onChange={() => {}}
            onSelectOption={(values) =>
              setSelectedStatus(values.map((item) => Number(item.value)))
            }
            staticItems={[
              { value: "1", label: "Aberto" },
              { value: "2", label: "Faturado Parcial" },
              { value: "3", label: "Faturado Total" },
              { value: "4", label: "Pendente" },
              { value: "5", label: "Suspenso" },
              { value: "6", label: "Cancelado" },
              { value: "-1", label: "Aprovação" },
              { value: "-2", label: "Reprovado" },
              { value: "-3", label: "Excluído" },
            ]}
            showSelectButtons
          />
        </div>
        <div className="flex gap-x-2 mt-5">
          <Button
            onClick={() => {
              setCustomWhere("");
              setTableToken(new Date().valueOf());
            }}
          >
            Aplicar Filtro
          </Button>
          <Button
            onClick={() => {
              setCustomWhere("");
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
    <AppPageHeader titleSlot="Pedidos de Venda">
      <div className="p-2">
        <ServerTable<OrderModel>
          key={tableToken}
          defaultSearchField="id"
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
        />
      </div>
    </AppPageHeader>
  );
}
