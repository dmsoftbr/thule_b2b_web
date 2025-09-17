import { FormInputQty } from "@/components/form/form-qty-input";
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
import { Input } from "@/components/ui/input";
import type { ProductModel } from "@/models/product.model";
import { MinusIcon, PlusIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useOrder } from "../-hooks/use-order";
import { api } from "@/lib/api";
import { ProductImage } from "@/components/app/product-image";
import { formatNumber } from "@/lib/number-utils";
import { v7 as uuidv7 } from "uuid";

export const SearchProductModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProductModel[]>([]);
  const { currentOrder, setCurrentOrder } = useOrder();
  useEffect(() => {
    if (isOpen) onSearch("");
  }, [isOpen]);

  async function onSearch(searchText: string) {
    startTransition(async () => {
      const { data } = await api.post("/registrations/products/search", {
        customerId: currentOrder.customerId,
        priceTableId: currentOrder.priceTableId,
        search: searchText,
        pageSize: 7,
      });

      setData(data);
    });
  }

  function handleAddItemToOrder(product: ProductModel, quantity: number) {
    const newOrder = { ...currentOrder };
    const existingItemIndex = newOrder.items.findIndex(
      (f) => f.productId == product.id
    );
    if (existingItemIndex >= 0) {
      newOrder.items[existingItemIndex].quantity = quantity;
    } else {
      newOrder.items.push({
        availability: "C",
        deliveryDate: new Date(),
        id: 0,
        orderId: Number(currentOrder.id),
        portalId: uuidv7(),
        product: product,
        productId: product.id,
        quantity,
        totalValue: quantity * product.unitPriceInTable,
        unitPriceBase: product.unitPriceInTable,
        unitPriceSuggest: product.suggestUnitPrice,
      });
    }
    setCurrentOrder(newOrder);
  }

  const columns: ServerTableColumn<ProductModel>[] = [
    {
      id: "photo",
      dataKey: "id",
      header: "Produto",
      render: (product) => (
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
      id: "id",
      dataKey: "id",
      header: "Código",
      render: (product) => (
        <span className="font-semibold text-blue-600 ">{product.id}</span>
      ),
      sortable: true,
    },
    {
      id: "referenceCode",
      dataKey: "referenceCode",
      header: "Código Curto",
      render: (product) => (
        <span className="font-semibold text-blue-600 text-sm">
          {product.referenceCode}
        </span>
      ),
      sortable: true,
    },
    {
      id: "description",
      dataKey: "description",
      header: "Descrição",
      render: (product) => (
        <span className="text-sm">{product.description}</span>
      ),
      sortable: true,
    },
    {
      id: "familyName",
      dataKey: "family.name",
      header: "Família",
      render: (product: ProductModel) => (
        <span className="text-sm">{product.productFamily?.name}</span>
      ),
      sortable: true,
    },
    {
      id: "PreçoSug",
      dataKey: "suggestUnitPrice",
      header: "Preço Sugerido",
      render: (item: ProductModel) => (
        <div className="font-semibold text-blue-600 w-full text-right">
          {formatNumber(item.suggestUnitPrice, 2)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "PrecoTabela",
      dataKey: "unitPriceInTable",
      header: "Preço Tabela",
      render: (item: ProductModel) => (
        <div className="font-semibold w-full text-right text-blue-600 ">
          {formatNumber(item.unitPriceInTable, 2)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "qty",
      dataKey: "id",
      header: "Quantidade",
      render: (product) => (
        <FormInputQty
          min={0}
          max={999999}
          step={1}
          minusSlot={<MinusIcon className="size-3" />}
          plusSlot={<PlusIcon className="size-3" />}
          onValueChange={(value) => (product.quantity = value ?? 0)}
        />
      ),
      sortable: false,
    },
    {
      id: "actions",
      dataKey: "id",
      header: "Ações",
      render: (product) => (
        <div>
          <Button
            onClick={() => {
              handleAddItemToOrder(
                product,
                product.quantity < 1 ? 1 : product.quantity
              );
            }}
          >
            <PlusIcon className="size-4" />
            Adicionar
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => setIsOpen(true)}>
          <SearchIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%]">
        <DialogHeader>
          <DialogTitle>
            Pesquisar Produtos - {currentOrder.priceTableId}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full">
          <div className="flex mb-2 items-center gap-x-2">
            <Button>
              <RefreshCwIcon />
            </Button>
            <Input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Digite parte do código longo, código curto ou descrição do produto"
            />
          </div>
          <ServerTable<ProductModel>
            columns={columns}
            data={data}
            totalItems={Math.ceil(data.length / 7)}
            keyExtractor={function (item: ProductModel): string | number {
              return item.id;
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
