import { ProductsCombo } from "@/components/app/products-combo";
import { Label } from "@/components/ui/label";
import { OrderItemCard } from "./order-item-card";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderSearchProductModal } from "./order-search-product-modal";
import { useOrder } from "../-hooks/use-order";
import type { ProductModel } from "@/models/product.model";
import { toast } from "sonner";
import { EmptyOrder } from "./empty-order";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/app/product-image";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import { FormInputQty } from "@/components/form/form-qty-input";
import { NEW_ORDER_ITEM_EMPTY } from "../-utils/order-utils";
import { api } from "@/lib/api";
import { OrderItemTableRow } from "./order-item-table-row";

interface Props {
  isEditing: boolean;
}

export const OrderFormItems = ({ isEditing }: Props) => {
  const { currentOrder, onAddItem: addItem } = useOrder();
  const [showCard, setShowCard] = useState(true);

  const hasCustomerAndPriceTable =
    currentOrder.customer && currentOrder.priceTableId;

  if (!hasCustomerAndPriceTable) {
    return (
      <div className="w-full p-2 flex flex-col items-center min-h-[100px]">
        <div className="my-4">
          Selecione o Cliente e a Tabela de Preço para poder selecionar os
          Produtos
        </div>
      </div>
    );
  }

  const handleAddItem = async (product: ProductModel | undefined) => {
    if (!product) return;
    if (
      currentOrder.items &&
      currentOrder.items?.findIndex(
        (f) => f.productId.toLowerCase() === product.id.toLowerCase()
      ) >= 0
    ) {
      toast.warning("Produto já consta no pedido!");
      return;
    }

    // chama a
    // api que calcula data de entrega

    var params = {
      orderId: currentOrder.id,
      customerAbbreviation: currentOrder.customerAbbreviation,
      productId: product.id,
      quantity: 1,
    };
    const { data: deliveryData } = await api.post(
      `/stock/caculate-delivery-date`,
      params
    );

    const newOrderItem: OrderItemModel = {
      ...NEW_ORDER_ITEM_EMPTY,
      ...product,
      productId: product.id,
      deliveryDate: deliveryData.estimatedDate,
      availability: deliveryData.availbility,
      unitPriceBase: product.unitPriceInTable,
      unitPriceSuggest: product.suggestUnitPrice,
      totalValue: product.unitPriceInTable * 1,
      quantity: 1,
      sequence: currentOrder.items.length + 10,
    };

    addItem(newOrderItem);
  };

  const orderTotal = currentOrder.items.reduce(
    (acc, b) => acc + b.unitPriceBase * b.quantity,
    0
  );

  return (
    <div className="w-full p-2 container flex flex-col items-center">
      <div className="flex gap-x-4 mb-2 container w-full">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex gap-x-2 w-full items-end">
            {currentOrder.orderClassificationId < 6 ? (
              <>
                <div className="flex-1 form-group">
                  <Label>Pesquisar Produto para Adicionar</Label>
                  <ProductsCombo
                    onSelect={handleAddItem}
                    priceTableId={currentOrder.priceTableId}
                    customerId={currentOrder.customerId}
                  />
                </div>
                <OrderSearchProductModal />
              </>
            ) : (
              <div></div>
            )}
            <Label>
              <Checkbox
                checked={showCard}
                onCheckedChange={(e) => setShowCard(e ? true : false)}
              />{" "}
              Ver em Cards
            </Label>
          </div>
        </div>
      </div>

      {!showCard && (
        <Table className="w-full table-fixed text-xs flex flex-col">
          <TableHeader className="flex">
            <TableRow className="flex w-full hover:bg-neutral-300 bg-neutral-300">
              <TableHead className="w-[72px] border flex items-center text-xs text-black">
                Imagem
              </TableHead>
              <TableHead className="flex-1 border flex items-center text-xs text-black">
                Produto
              </TableHead>
              <TableHead className="w-[160px] border flex items-center text-xs text-black">
                Qtde
              </TableHead>
              <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                <span>Preço</span>
                <span>Sugerido</span>
              </TableHead>
              <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                <span>Valor</span>
                <span>c/Desconto</span>
              </TableHead>
              <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                <span>Total</span>
                <span>c/Desconto</span>
              </TableHead>
              <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                Prev. Entrega
              </TableHead>

              <TableHead className="w-[100px] border flex items-center text-xs text-black">
                Ações
              </TableHead>
              <TableHead className="w-[17px] max-w-[17px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            className="flex flex-col overflow-y-visible w-full"
            style={{ maxHeight: "230px" }}
          >
            {currentOrder.items?.map((item: OrderItemModel, index: number) => (
              <OrderItemTableRow
                key={index}
                item={item}
                isEditing={isEditing}
              />
            ))}
          </TableBody>
          <TableFooter className="flex w-full">
            <TableRow className="flex w-full bg-neutral-300 align-middle text-sm hover:bg-neutral-300">
              <TableHead
                colSpan={2}
                className="flex-1 border-[0.5px] flex items-center"
              >
                Total
              </TableHead>
              <TableHead className=" border-[0.5px] w-[160px]   flex items-center justify-end">
                {currentOrder.items?.length}
              </TableHead>
              <TableHead
                colSpan={2}
                className="w-[240px] border-[0.5px]"
              ></TableHead>
              <TableHead className="w-[120px] border-[0.5px] text-right  flex items-center justify-end">
                {formatNumber(
                  currentOrder.items?.reduce(
                    (acc, b) => (acc += b.quantity * b.unitPriceBase),
                    0
                  ),
                  2
                )}
              </TableHead>
              <TableHead className="w-[220px] border-r"></TableHead>
              <TableHead className="w-[17px]"></TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      )}
      {showCard && (
        <div
          className={cn(
            "grid grid-cols-[70%_30%] border-y w-full",
            !currentOrder.items && "grid-cols-1 border-0"
          )}
        >
          <ScrollArea
            className={""}
            style={{ height: "calc(100vh - 330px)" }}
            type="always"
          >
            {!currentOrder.items?.length && <EmptyOrder />}
            {currentOrder.items?.map((item: OrderItemModel, index) => (
              <OrderItemCard
                key={`${item.productId}_${index}`}
                data={item}
                className="even:bg-neutral-300"
              />
            ))}
          </ScrollArea>
          {currentOrder.items && (
            <div className="border-x  flex items-center justify-center flex-col">
              <div className="flex items-center text-lg font-semibold">
                Total do Pedido: R$ {formatNumber(orderTotal, 2)}
                <div className="text-xs font-semibold bg-neutral-700 text-white rounded px-1.5 py-0.5 flex items-center justify-center ml-2">
                  {`(${currentOrder.items.length}) ${currentOrder.items.length > 1 ? "itens" : "item"}`}
                </div>
              </div>
              <div className="text-green-600 font-semibold">
                Desconto: R${" "}
                {formatNumber(
                  orderTotal * (currentOrder.discountPercentual / 100),
                  2
                )}
              </div>
              <div className="text-xl font-bold">
                Total com Desconto: R${" "}
                {formatNumber(
                  orderTotal * (1 - currentOrder.discountPercentual / 100),
                  2
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
