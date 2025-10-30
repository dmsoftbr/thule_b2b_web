import { Button } from "@/components/ui/button";
import { ServerTable } from "@/components/server-table/server-table";
import type { OrderModel } from "@/models/orders/order-model";
import { FilterIcon, PlusIcon, RefreshCcwIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceCallback } from "usehooks-ts";
import { RepresentativesService } from "@/services/registrations/representatives.service";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/date-picker";
import { api } from "@/lib/api";
import { type PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import { type PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import { createBudgetsTableColumns } from "./budgets-table-columns";

export const BudgetsTable = () => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<PagedResponseModel<OrderModel>>();
  console.log(data);
  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: () => new RepresentativesService().getAll(),
    select: (data) => {
      const newData: SearchComboItem[] = data.map((rep) => {
        return {
          value: rep.id.toString(),
          label: rep.abbreviation,
          extra: rep,
          keyworks: [rep.id.toString(), rep.abbreviation, rep.name],
        };
      });
      return newData;
    },
  });

  const debouncedSearchText = useDebounceCallback(setSearchText, 500);
  const navigate = useNavigate();

  const onAddOrder = () => {
    navigate({ to: "/budgets/new-budget" });
  };

  const handleView = (budget: OrderModel) => {
    navigate({ to: `/budget/${budget.id}` });
  };

  const columns = createBudgetsTableColumns({ fnView: handleView });

  const getData = async () => {
    const params: PagedRequestModel = {
      currentPage: 0,
      pageSize: 10,
      search: "",
      searchField: "id",
      sortDir: "asc",
      sortField: "id",
    };
    const { data } = await api.post("/orders/list-paged", params);
    setData(data);
  };

  useEffect(() => {
    getData();
  }, [searchText]);

  return (
    <div className="">
      <div className="flex items-center gap-x-1 mb-2">
        <Button
          size="sm"
          variant="blue"
          className="h-9"
          onClick={() => getData()}
        >
          <RefreshCcwIcon className="size-4" />
        </Button>
        <Select defaultValue="simulacao">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar Campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simulacao">Simulação</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          size="sm"
          className="h-9"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <FilterIcon className="size-4" />
        </Button>
        <Input
          defaultValue={searchText}
          onChange={(e) => debouncedSearchText(e.target.value)}
          placeholder="Procurar"
          className="flex-1"
        />
        <Button
          size="sm"
          variant="default"
          onClick={() => onAddOrder()}
          className="h-9"
        >
          <PlusIcon className="size-4" /> Nova Simulação
        </Button>
      </div>
      <Collapsible
        open={showAdvancedFilters}
        onOpenChange={setShowAdvancedFilters}
      >
        <CollapsibleContent className="mb-1 space-y-2 mt-1 grid grid-cols-4 gap-x-4 bg-neutral-100 px-2 py-2 rounded-md border">
          <div className="flex flex-col space-y-1">
            <Label>Status da Simulação:</Label>
            <SearchCombo
              multipleSelect
              showSelectButtons
              staticItems={[
                {
                  value: "OPEN",
                  label: "Aberto",
                },
                {
                  value: "IN_APPROVAL",
                  label: "Em Aprovação",
                },
                {
                  value: "INTEGRATION_PENDING",
                  label: "Pendente Integração",
                },
                {
                  value: "INTEGRATION_ERROR",
                  label: "Erro na Integração",
                },
                {
                  value: "APPROVED",
                  label: "Aprovado",
                },
                {
                  value: "REJECTED",
                  label: "Rejeitado",
                },
                {
                  value: "CANCELLED",
                  label: "Cancelado",
                },
              ]}
              onChange={() => {}}
              placeholder="Status da Simulação"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label>Representante:</Label>
            <SearchCombo
              multipleSelect
              showSelectButtons
              staticItems={representativesData}
              showValueInSelectedItem
              onChange={() => {}}
              placeholder="Todos"
            />
          </div>

          <div className="flex space-y-1">
            <div className="flex flex-col space-y-1">
              <Label>Período de Inclusão</Label>
              <div className="flex gap-x-2 items-center justify-center text-sm">
                <DatePicker placeholder="Início" />a
                <DatePicker placeholder="Término" />
              </div>
            </div>
          </div>
          <div></div>
          <Button size="sm" className="max-w-[140px]">
            <FilterIcon />
            Aplicar Filtro
          </Button>
        </CollapsibleContent>
      </Collapsible>
      <ServerTable
        columns={columns}
        dataUrl="/budgets/list-paged"
        searchFields={[{ id: "id", label: "Pedido" }]}
      />
    </div>
  );
};
