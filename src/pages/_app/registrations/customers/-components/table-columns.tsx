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
}: Props): ServerTableColumn<CustomerModel>[] => [
  {
    id: "id",
    dataKey: "id",
    header: "Código",
    render: (group) => (
      <span className="font-semibold text-blue-600 ">{group.id}</span>
    ),
    sortable: true,
  },
  {
    id: "abbreviation",
    dataKey: "abbreviation",
    header: "Nome Abreviado",
    render: (customer) => <span>{customer.abbreviation}</span>,
    sortable: true,
  },
  {
    id: "name",
    dataKey: "name",
    header: "Nome",
    render: (customer) => <span>{customer.name}</span>,
    sortable: true,
  },
  {
    id: "documentNumber",
    dataKey: "documentNumber",
    header: "CPF/CNPJ",
    render: (customer) => <span>{customer.documentNumber}</span>,
    sortable: true,
  },
  {
    id: "id",
    dataKey: "id",
    header: "Ações",
    render: (customer) => (
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
