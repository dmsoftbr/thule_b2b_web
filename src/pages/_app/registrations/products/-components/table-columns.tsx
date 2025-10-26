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
}: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (product) => (
      <span className="font-semibold text-blue-600 ">{product.id}</span>
    ),
    sortable: true,
  },
  {
    key: "description",
    dataIndex: "description",
    title: "Descrição",
    renderItem: (product: any) => <span>{product.description}</span>,
    sortable: true,
  },
  {
    key: "id",
    dataIndex: "id",
    title: "Ações",
    renderItem: (product: any) => (
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
