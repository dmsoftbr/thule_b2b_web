import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import { format } from "date-fns";
import { MenuIcon } from "lucide-react";

interface Props {
  fnEdit: (data: PriceTableModel) => void;
  fnShowPrices: (data: PriceTableModel) => void;
  fnShowProductsException: (data: PriceTableModel) => void;
  fnShowBranchesException: (data: PriceTableModel) => void;
}

export const columns = ({
  fnEdit,
  fnShowPrices,
  fnShowProductsException,
  fnShowBranchesException,
}: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: PriceTableModel) => {
      return <span className="text-blue-600 font-semibold">{item.id}</span>;
    },
  },
  {
    title: "Descrição",
    dataIndex: "name",
    key: "name",
    sortable: true,
  },
  {
    title: "Nome no Portal",
    dataIndex: "portalName",
    key: "portalName",
    sortable: true,
  },
  {
    title: "Validade",
    dataIndex: "validFrom",
    key: "validity",
    sortable: true,
    renderItem: (row: PriceTableModel) => {
      return (
        <span>
          {format(row.validFrom, "dd/MM/yyyy")} até{" "}
          {format(row.validTo, "dd/MM/yyyy")}
        </span>
      );
    },
  },
  {
    title: "Zera Desconto?",
    dataIndex: "zeroDiscount",
    key: "zeroDiscount",
    sortable: false,
    renderItem: (row: PriceTableModel) => (
      <span>{row.zeroDiscount ? "Sim" : "Não"}</span>
    ),
  },
  {
    title: "Ativa?",
    dataIndex: "isActive",
    key: "isActive",
    sortable: false,
    renderItem: (row: PriceTableModel) => (
      <span>{row.isActive ? "Sim" : "Não"}</span>
    ),
  },
  {
    title: "É Tab. Excessão?",
    dataIndex: "isException",
    key: "isException",
    sortable: false,
    renderItem: (row: PriceTableModel) => (
      <span className={cn(row.isException && "bg-red-300 text-white")}>
        {row.isException ? "Sim" : "Não"}
      </span>
    ),
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (row: PriceTableModel) => (
      <div className="flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnEdit(row)}>
              Alterar Tabela
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnShowPrices(row)}>
              Ver Preços
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnShowProductsException(row)}>
              Excessão de Produtos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnShowBranchesException(row)}>
              Excessão de Estabelecimetos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
  // {
  //   title: "Ações",
  //   dataIndex: "id",
  //   key: "actions",
  //   renderItem: (row: PriceTableModel) => (
  //     <div className="flex flex-wrap gap-x-1 items-center">
  //       <Button
  //         size="sm"
  //         type="button"
  //         onClick={() => {
  //           fnEdit(row);
  //         }}
  //       >
  //         <EditIcon className="size-4" />
  //       </Button>
  //     </div>
  //   ),
  // },
];
