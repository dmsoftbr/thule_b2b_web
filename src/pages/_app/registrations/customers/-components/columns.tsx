import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/lib/number-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { MenuIcon } from "lucide-react";

interface Props {
  fnPriceTables: (data: CustomerModel) => void;
  fnSalesGroup: (data: CustomerModel) => void;
}

export const columns = ({
  fnPriceTables,
  fnSalesGroup,
}: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (group) => (
      <span className="font-semibold text-blue-600 ">{group.id}</span>
    ),
    sortable: true,
  },
  {
    key: "abbreviation",
    dataIndex: "abbreviation",
    title: "Nome Abreviado",
    renderItem: (customer) => <span>{customer.abbreviation}</span>,
    sortable: true,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Nome",
    renderItem: (customer) => <span>{customer.name}</span>,
    sortable: true,
  },
  {
    key: "documentNumber",
    dataIndex: "documentNumber",
    title: "CPF/CNPJ",
    renderItem: (customer: any) => <span>{customer.documentNumber}</span>,
    sortable: true,
  },
  {
    key: "discountPercent",
    dataIndex: "discountPercent",
    title: "% Desconto",
    renderItem: (customer: any) => (
      <div className="text-right">
        {formatNumber(customer.discountPercent, 2)}
      </div>
    ),
    sortable: false,
  },
  {
    key: "representative",
    dataIndex: "representative.name",
    title: "Representante",
    renderItem: (customer: any) => (
      <span>
        {customer.representativeId} - {customer.representative?.abbreviation}
      </span>
    ),
    sortable: false,
  },
  {
    key: "carrier",
    dataIndex: "carrier.abbreviation",
    title: "Transportadora Padrão",
    renderItem: (customer: any) => (
      <span>
        {customer.carrierId} - {customer.carrier?.abbreviation}
      </span>
    ),
    sortable: false,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (customer: any) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnPriceTables(customer)}>
              Tabelas de Preço
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fnSalesGroup(customer)}>
              Grupos de Venda
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
