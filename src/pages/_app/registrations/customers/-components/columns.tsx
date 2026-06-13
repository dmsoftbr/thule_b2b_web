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
  fnDiscountGroups: (data: CustomerModel) => void;
}

export const columns = ({
  fnPriceTables,
  fnSalesGroup,
  fnDiscountGroups,
}: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (group) => (
      <span className="font-semibold text-blue-600 ">{group.id}</span>
    ),
    sortable: true,
  },
  {
    key: "abbreviation",
    dataIndex: "abbreviation",
    title: "Nome Abreviado",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer) => <span>{customer.abbreviation}</span>,
    sortable: true,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Nome",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer) => <span>{customer.name}</span>,
    sortable: true,
  },
  {
    key: "documentNumber",
    dataIndex: "documentNumber",
    title: "CPF/CNPJ",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: any) => <span>{customer.documentNumber}</span>,
    sortable: true,
  },
  {
    key: "discountPercent",
    dataIndex: "discountPercent",
    title: "% Desconto",
    className: "text-xs",
    cellClassName: "text-xs",
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
    className: "text-xs",
    cellClassName: "text-xs",
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
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: any) => (
      <span>
        {customer.carrierId} - {customer.carrier?.abbreviation}
      </span>
    ),
    sortable: false,
  },
  {
    key: "salesGroup",
    dataIndex: "salesGroup",
    title: "Grupos de Venda",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: any) => (
      <span>
        {(customer.salesGroup ?? [])
          .map((g: any) => g.groupId)
          .join(", ")}
      </span>
    ),
    sortable: false,
  },
  {
    key: "priceExceptionTables",
    dataIndex: "priceExceptionTables",
    title: "Grupo de Desconto",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: any) => (
      <span>
        {(customer.priceExceptionTables ?? [])
          .map((e: any) => e.exceptionTableId)
          .filter(Boolean)
          .join(", ")}
      </span>
    ),
    sortable: false,
  },
  {
    key: "priceTables",
    dataIndex: "priceTables",
    title: "Tabelas de Preço",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: any) => (
      <span>
        {(customer.priceTables ?? [])
          .map((p: any) => p.id)
          .join(", ")}
      </span>
    ),
    sortable: false,
  },
  {
    key: "group",
    dataIndex: "group.name",
    title: "Grupo do Cliente",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: any) =>
      customer.group ? (
        <span>
          {customer.group.id} - {customer.group.name}
        </span>
      ) : (
        <span></span>
      ),
    sortable: false,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    className: "text-xs",
    cellClassName: "text-xs",
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
            <DropdownMenuItem onClick={() => fnDiscountGroups(customer)}>
              Grupos de Desconto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
