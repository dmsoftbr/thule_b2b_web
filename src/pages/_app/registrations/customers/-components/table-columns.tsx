import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { MenuIcon } from "lucide-react";

interface Props {
  fnDetails: (data: CustomerModel) => void;
}

export const createCustomersTableColumns = ({
  fnDetails,
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
    key: "id",
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
            <DropdownMenuItem onClick={() => fnDetails(customer)}>
              Informações Adicionais
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
