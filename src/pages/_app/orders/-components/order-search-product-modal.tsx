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
import type { ProductModel } from "@/models/product.model";
import { MinusIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { ProductImage } from "@/components/app/product-image";
import { formatNumber } from "@/lib/number-utils";
import { useOrder } from "../-context/order-context";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import { SearchCombo } from "@/components/ui/search-combo";
import { AppTooltip } from "@/components/layout/app-tooltip";

export const OrderSearchProductModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { order, setOrder } = useOrder();
  const [priceTable, setPriceTable] = useState<PriceTableModel | null>(null);
  const [tableToken, setTableToken] = useState(new Date().valueOf());

  function handleAddItemToOrder(
    priceTable: PriceTableModel,
    product: ProductModel,
    orderQuantity: number
  ) {
    const newOrder = { ...order };
    const existingItemIndex = newOrder.items.findIndex(
      (f) => f.productId == product.id
    );
    if (existingItemIndex >= 0) {
      newOrder.items[existingItemIndex].orderQuantity = orderQuantity;
    } else {
      newOrder.items.push({
        availability: "C",
        deliveryDate: new Date(),
        sequence: 0,
        orderId: order.id,
        product: product,
        productId: product.id,
        orderQuantity,
        grossItemValue: orderQuantity * product.unitPriceInTable,
        inputPrice: product.unitPriceInTable,
        suggestPrice: product.suggestUnitPrice,
        allocatedQuantity: 0,
        comments: "",
        customerAbbreviation: order.customerAbbreviation,
        deliveredQuantity: 0,
        fiscalClassificationId: "",
        id: "",
        ncm: "",
        netItemValue: 0,
        originalDeliveryDate: new Date(),
        priceTablePrice: product.unitPriceInTable,
        referenceCode: product.referenceCode,
        statusId: 1,
        priceTableId: priceTable.id,
        priceTable,
        taxes: [],
      });
    }
    setOrder(newOrder);
  }

  const columns: ServerTableColumn[] = [
    {
      key: "photo",
      dataIndex: "id",
      title: "Produto",
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
      renderItem: (product) => (
        <span className="font-semibold text-blue-600 ">{product.id}</span>
      ),
      sortable: true,
    },
    {
      key: "referenceCode",
      dataIndex: "referenceCode",
      title: "Código Curto",
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
      renderItem: (product) => (
        <span className="text-sm">{product.description}</span>
      ),
      sortable: true,
    },
    {
      key: "familyName",
      dataIndex: "family.name",
      title: "Família",
      renderItem: (product: ProductModel) => (
        <span className="text-sm">{product.productFamily?.name}</span>
      ),
      sortable: true,
    },
    {
      key: "PreçoSug",
      dataIndex: "suggestUnitPrice",
      title: "Preço Sugerido",
      renderItem: (item: ProductModel) => (
        <div className="font-semibold text-blue-600 w-full text-right">
          {formatNumber(item.suggestUnitPrice, 2)}
        </div>
      ),
      sortable: true,
    },
    {
      key: "PrecoTabela",
      dataIndex: "unitPriceInTable",
      title: "Preço Tabela",
      renderItem: (item: ProductModel) => (
        <div className="font-semibold w-full text-right text-blue-600 ">
          {formatNumber(item.unitPriceInTable, 2)}
        </div>
      ),
      sortable: true,
    },
    {
      key: "qty",
      dataIndex: "id",
      title: "Quantidade",
      renderItem: (product) => (
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
      key: "actions",
      dataIndex: "id",
      title: "Ações",
      renderItem: (product) => (
        <div>
          <Button
            onClick={() => {
              if (!priceTable) return;
              handleAddItemToOrder(
                priceTable,
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
          <DialogTitle>Pesquisar Produtos</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full">
          <ServerTable<ProductModel>
            key={tableToken}
            searchSlot={
              <AppTooltip message="Tabela de Preço">
                <SearchCombo
                  className="min-w-[250px]"
                  apiEndpoint={`/registrations/customer-price-tables/customer/${order.customerId}`}
                  valueProp="priceTableId"
                  labelProp="priceTableId"
                  placeholder="Selecione uma Tabela de Preço"
                  searchPlaceholder="Procurar Tabela de Preço"
                  defaultValue={priceTable?.id ?? ""}
                  onSelectOption={(opt) => {
                    setPriceTable(opt[0].extra?.priceTable);
                    setTableToken(new Date().valueOf());
                  }}
                />
              </AppTooltip>
            }
            columns={columns}
            dataUrl="/registrations/products/list-paged"
            searchFields={[]}
            defaultPageSize={8}
            defaultSearchField="all"
            additionalInfo={{ priceTableId: priceTable?.id ?? "" }}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
