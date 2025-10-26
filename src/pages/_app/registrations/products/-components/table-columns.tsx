import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductModel } from "@/models/product.model";
import { MenuIcon } from "lucide-react";

interface Props {
  fnDetails: (data: ProductModel) => void;
}

export const createProductsTableColumns = ({
  fnDetails,
}: Props): ServerTableColumn<ProductModel>[] => [
  {
    id: "id",
    dataKey: "id",
    header: "Código",
    render: (product) => (
      <span className="font-semibold text-blue-600 ">{product.id}</span>
    ),
    sortable: true,
  },
  {
    id: "description",
    dataKey: "description",
    header: "Descrição",
    render: (product) => <span>{product.description}</span>,
    sortable: true,
  },
  {
    id: "id",
    dataKey: "id",
    header: "Ações",
    render: (product) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnDetails(product)}>
              Informações Adicionais
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
