import {
  ServerTable,
  type ServerTableColumn,
} from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductModel } from "@/models/product.model";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { ProductImage } from "@/components/app/product-image";

import { PRODUCT_ACTIVE_STATES } from "@/constants";
import { cn } from "@/lib/utils";

interface Props {
  onSelect: (product: ProductModel | null) => void;
}

export const SearchProductModal = ({ onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductModel | null>(null);

  const columns: ServerTableColumn[] = [
    {
      key: "photo",
      dataIndex: "id",
      title: "Produto",
      className: "!w-[80px]",
      cellClassName: "!w-[80px] flex items-center justify-center p-1",
      renderItem: (product) => (
        <div className="size-14">
          <ProductImage
            productId={product.id}
            alt="Foto do Produto"
            className="size-14"
            onClick={(url) => window.open(url, "_blank")}
          />
        </div>
      ),
      sortable: true,
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Código",
      className: "w-[128px] border",
      renderItem: (product) => (
        <span className="font-semibold text-blue-600 ">{product.id}</span>
      ),
      sortable: true,
    },
    {
      key: "referenceCode",
      dataIndex: "referenceCode",
      title: "Código Curto",
      className: "w-[128px] border",
      renderItem: (product) => (
        <span className="font-semibold text-blue-600 text-sm">
          {product.referenceCode}
        </span>
      ),
      sortable: true,
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Descrição",
      cellClassName: "border text-xs",
      renderItem: (product) => (
        <span className="text-sm">{product.description}</span>
      ),
      sortable: true,
    },
    {
      key: "familyName",
      dataIndex: "family.name",
      title: "Família",
      className: "w-[128px] border",
      renderItem: (product: ProductModel) => (
        <span className="text-sm">{product.familyId}</span>
      ),
      sortable: true,
    },
    // {
    //   key: "PreçoSug",
    //   dataIndex: "suggestUnitPrice",
    //   title: "Preço Sugerido",
    //   className: "w-[128px] border",

    //   renderItem: (item: ProductModel) => (
    //     <div className="font-semibold text-blue-600 w-full text-right">
    //       {formatNumber(item.suggestUnitPrice, 2)}
    //     </div>
    //   ),
    //   sortable: true,
    // },
    // {
    //   key: "stock",
    //   dataIndex: "stock",
    //   title: "Estoque",
    //   className: "w-[128px] border",
    //   renderItem: (item: ProductModel) => (
    //     <div className="font-semibold text-blue-600 w-full text-right">
    //       {formatNumber(item.suggestUnitPrice, 2)}
    //     </div>
    //   ),
    //   sortable: true,
    // },
    // {
    //   key: "estimatedDate",
    //   dataIndex: "estimatedDate",
    //   title: "Prev. Chegada",
    //   className: "w-[128px] border",
    //   renderItem: (item: ProductModel) => (
    //     <div className="font-semibold text-blue-600 w-full text-right">
    //       {formatNumber(item.suggestUnitPrice, 2)}
    //     </div>
    //   ),
    //   sortable: true,
    // },
    {
      key: "isActive",
      dataIndex: "isActive",
      title: "Situação",
      className: "w-[170px] border",
      renderItem: (item: ProductModel) => (
        <div className="text-[10px]">
          {item.isActive > 1 && (
            <span
              className={cn(
                item.isActive == 2 && "bg-purple-300  p-1 rounded-md",

                item.isActive == 3 && "bg-orange-300  p-1 rounded-md",
                item.isActive == 4 && "bg-red-400 text-white p-1 rounded-md",
              )}
            >
              {PRODUCT_ACTIVE_STATES[item.isActive]}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  const handleSelect = (row: ProductModel | null) => {
    if (row) {
      onSelect(row);
      setIsOpen(false);
      return;
    }
    onSelect(selectedItem);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => setIsOpen(true)}>
          {/* <FilterIcon className="w-4 h-4" /> */}
          <SearchIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-w-[90%]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Pesquisar Produtos</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full">
          <ServerTable<ProductModel>
            columns={columns}
            searchAutoFocus
            showAddButton={false}
            defaultPageSize={6}
            dataUrl="/registrations/products/list-paged"
            searchFields={[]}
            defaultSearchField="all"
            onSelectRow={(row) => {
              setSelectedItem(row);
              handleSelect(row);
            }}
            onRowDblClick={(row) => {
              setSelectedItem(row);
              handleSelect(row);
            }}
          />
        </div>
        <DialogFooter>
          <Button disabled={!selectedItem} onClick={() => handleSelect(null)}>
            Selecionar
          </Button>

          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
