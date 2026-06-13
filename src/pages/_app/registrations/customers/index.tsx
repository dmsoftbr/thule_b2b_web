import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";

import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { columns } from "./-components/columns";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SearchCombo } from "@/components/ui/search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import type { PriceExceptionTableModel } from "@/models/registrations/price-exception-table.model";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";

// Filtros persistidos na URL (search params nativos do TanStack Router):
//   gd = Grupos de Desconto (ExceptionTableId), gv = Grupos de Venda (GroupId).
// .catch([]) tolera URL malformada/ausente sem quebrar a rota.
const customersSearchSchema = z.object({
  gd: z.array(z.string()).catch([]),
  gv: z.array(z.string()).catch([]),
});

export const Route = createFileRoute("/_app/registrations/customers/")({
  component: CustomersPageComponent,
  pendingComponent: TableSkeleton,
  validateSearch: (search) => customersSearchSchema.parse(search),
});

const searchFieldsList: ServerTableSearchField[] = [
  { id: "id", label: "Código" },
  { id: "abbreviation", label: "Nome Abreviado" },
  { id: "documentNumber", label: "CPF/CNPJ" },
];

const groupLabel = (item: { id: string; name?: string }) =>
  item.name ? `${item.id} - ${item.name}` : item.id;

function CustomersPageComponent() {
  const navigate = useNavigate();
  const { gd, gv } = Route.useSearch();

  // Seleção "pendente" dos combos (antes de clicar Aplicar). A seleção "aplicada"
  // é a da URL (gd/gv), usada no additionalInfo — assim refresh/voltar mantém o filtro.
  const [pendingGd, setPendingGd] = useState<string[]>(gd);
  const [pendingGv, setPendingGv] = useState<string[]>(gv);
  // Força o ServerTable a rebuscar (e os combos a re-sincronizar) ao aplicar/limpar.
  const [tableToken, setTableToken] = useState(new Date().valueOf());

  const { data: exceptionTables } = useQuery({
    queryKey: ["price-exception-tables-all"],
    queryFn: async () =>
      (
        await api.get<PriceExceptionTableModel[]>(
          "/registrations/price-exception-tables/all"
        )
      ).data,
  });

  const { data: salesGroups } = useQuery({
    queryKey: ["sales-groups-all"],
    queryFn: async () =>
      (await api.get<SalesGroupModel[]>("/registrations/sales-groups/all")).data,
  });

  // Referências ESTÁVEIS dos itens dos combos. Sem o useMemo, o array era recriado
  // a cada render e o SearchCombo reaplicava o defaultValue (resetando o clique).
  const gdItems = useMemo(
    () => convertArrayToSearchComboItem(exceptionTables ?? [], "id", groupLabel),
    [exceptionTables]
  );
  const gvItems = useMemo(
    () => convertArrayToSearchComboItem(salesGroups ?? [], "id", groupLabel),
    [salesGroups]
  );

  const applyFilters = () => {
    navigate({
      to: "/registrations/customers",
      search: { gd: pendingGd, gv: pendingGv },
    });
    setTableToken(new Date().valueOf());
  };

  const clearFilters = () => {
    setPendingGd([]);
    setPendingGv([]);
    navigate({ to: "/registrations/customers", search: { gd: [], gv: [] } });
    setTableToken(new Date().valueOf());
  };

  const handlePriceTables = async (data: CustomerModel) => {
    navigate({ to: `/registrations/customers/${data.id}/price-tables` });
  };
  const handleSalesGroup = async (data: CustomerModel) => {
    navigate({ to: `/registrations/customers/${data.id}/sales-group` });
  };
  const handleDiscountGroups = async (data: CustomerModel) => {
    navigate({ to: `/registrations/customers/${data.id}/price-exception-tables` });
  };

  const renderAdvancedFilter = () => (
    <div className="mt-2 flex flex-wrap items-end gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="form-group flex-1 min-w-[240px]">
        <Label>Grupo de Desconto</Label>
        <SearchCombo
          // remonta ao aplicar/limpar para refletir a seleção vinda da URL
          key={`gd-${tableToken}`}
          multipleSelect
          showSelectButtons
          defaultValue={gd}
          onChange={() => {}}
          staticItems={gdItems}
          onSelectOption={(opts) => setPendingGd(opts.map((o) => o.value))}
        />
      </div>
      <div className="form-group flex-1 min-w-[240px]">
        <Label>Grupo de Venda</Label>
        <SearchCombo
          key={`gv-${tableToken}`}
          multipleSelect
          showSelectButtons
          defaultValue={gv}
          onChange={() => {}}
          staticItems={gvItems}
          onSelectOption={(opts) => setPendingGv(opts.map((o) => o.value))}
        />
      </div>
      <div className="flex gap-x-2">
        <Button onClick={applyFilters}>Aplicar Filtro</Button>
        <Button variant="outline" onClick={clearFilters}>
          Limpar
        </Button>
      </div>
    </div>
  );

  return (
    <AppPageHeader titleSlot="Clientes">
      <div className="p-2">
        <ServerTable<CustomerModel>
          key={tableToken}
          defaultSearchField="abbreviation"
          defaultSortFieldDataIndex="abbreviation"
          searchFields={searchFieldsList}
          columns={columns({
            fnPriceTables: handlePriceTables,
            fnSalesGroup: handleSalesGroup,
            fnDiscountGroups: handleDiscountGroups,
          })}
          showAddButton={false}
          dataUrl="/registrations/customers/list-paged"
          additionalInfo={{ exceptionTableIds: gd, salesGroupIds: gv }}
          advancedFilterSlot={renderAdvancedFilter()}
          showAdvancedFilter
          advancedFilterActive={gd.length > 0 || gv.length > 0}
        />
      </div>
    </AppPageHeader>
  );
}
