import { ProductsCombo } from "@/components/app/products-combo";
import { Label } from "@/components/ui/label";
import { OrderItemCard } from "./order-item-card";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchProductModal } from "./search-product-modal";
import { useOrder } from "../-hooks/use-order";
import type { ProductModel } from "@/models/product.model";
import { toast } from "sonner";
import type { OrderItemModel } from "@/models/order-item-model";
import { EmptyOrder } from "./empty-order";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import { v7 as uuiv7 } from "uuid";
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

interface Props {}

export const OrderFormItems = ({}: Props) => {
  const { currentOrder, onAddItem: addItem } = useOrder();
  const [showCard, setShowCard] = useState(true);

  const hasCustomerAndPriceTable =
    currentOrder.customer && currentOrder.priceTable;

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

  const handleAddItem = (product: ProductModel | undefined) => {
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
    const newOrderItem: OrderItemModel = {
      id: 0,
      orderId: 0,
      productId: product.id,
      quantity: 1,
      deliveryDate: new Date(),
      availability: "C",
      totalValue: 0,
      unitPriceBase: product.unitPriceInTable,
      unitPriceSuggest: product.suggestUnitPrice,
      product,
      portalId: uuiv7(),
    };
    addItem(newOrderItem);
  };

  // useEffect(() => {
  //   console.log(currentOrder.items);
  // }, [currentOrder]);

  const orderTotal = currentOrder.items?.reduce(
    (acc, b) => acc + b.unitPriceBase * b.quantity,
    0
  );

  return (
    <div className="w-full p-2 container flex flex-col items-center">
      <div className="flex gap-x-4 mb-2 container w-full">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex gap-x-2 w-full items-end">
            <div className="flex-1 form-group">
              <Label>Pesquisar Produto para Adicionar</Label>
              <ProductsCombo
                onSelect={handleAddItem}
                priceTableId={currentOrder.priceTableId}
                customerId={currentOrder.customerId}
              />
            </div>
            <SearchProductModal />
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
        <Table className="w-full table-fixed border-separate">
          <TableHeader>
            <TableRow className="flex w-full hover:bg-neutral-300 bg-neutral-300">
              <TableHead className="w-[136px] border flex items-center text-xs text-black">
                Imagem
              </TableHead>
              <TableHead className="w-[100px] border flex items-center text-xs text-black">
                Código
              </TableHead>
              <TableHead className="flex-1 border flex items-center text-xs text-black">
                Descrição
              </TableHead>
              <TableHead className="w-[90px] border flex items-center text-xs text-black">
                Qtde
              </TableHead>
              <TableHead className="w-[115px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                <span>Preço</span>
                <span>Sugerido</span>
              </TableHead>
              <TableHead className="w-[100px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                <span>Valor</span>
                <span>c/Desconto</span>
              </TableHead>
              <TableHead className="w-[130px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                <span>Total</span>
                <span>c/Desconto</span>
              </TableHead>
              <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                Prev. Entrega
              </TableHead>
              <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
                Margem/Markup
              </TableHead>
              <TableHead className="w-[100px] border flex items-center text-xs text-black">
                Ações
              </TableHead>
              <TableHead className="w-[17px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            className="flex flex-col overflow-y-visible w-full"
            style={{ maxHeight: "230px" }}
          >
            {currentOrder.items?.map((item: OrderItemModel, index: number) => (
              <TableRow key={index} className="flex w-full even:bg-muted">
                <TableCell className="w-[136px] border-r border-l p-1">
                  <ProductImage
                    productId={item.productId}
                    alt={item.productId}
                  />
                </TableCell>
                <TableCell className="w-[100px]  border-r">
                  {item.productId}
                </TableCell>
                <TableCell className="flex-1  border-r">
                  {item.product.description}
                </TableCell>
                <TableCell className="w-[90px]  border-r text-right">
                  {item.quantity}
                </TableCell>
                <TableCell className="w-[115px]  border-r text-right">
                  {formatNumber(item.unitPriceSuggest, 2)}
                </TableCell>
                <TableCell className="w-[100px]  border-r text-right">
                  {formatNumber(item.unitPriceBase, 2)}
                </TableCell>
                <TableCell className="w-[130px]  border-r text-right">
                  {formatNumber(item.totalValue, 2)}
                </TableCell>
                <TableCell className="w-[120px]  border-r flex-wrap ">
                  {item.deliveryDate?.toLocaleDateString()}{" "}
                  <Badge
                    title={
                      item.availability == "C" ? "Em Estoque" : "BackOrder"
                    }
                    variant={
                      item.availability == "C" ? "default" : "destructive"
                    }
                  >
                    {item.availability}
                  </Badge>
                </TableCell>
                <TableCell className="w-[120px] border-r">0</TableCell>
                <TableCell className="w-[100px] border-r">
                  <Button size="icon" variant="blue">
                    <PencilIcon />
                  </Button>
                  <Button size="icon" variant="destructive">
                    <TrashIcon />
                  </Button>
                </TableCell>
                <TableCell className="w-[7px] p-0"></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="flex w-full">
            <TableRow className="flex w-full bg-neutral-300">
              <TableCell colSpan={3} className="flex-1 border-[0.5px]">
                Total
              </TableCell>
              <TableCell className=" border-[0.5px] w-[90px] text-right">
                {currentOrder.items.length}
              </TableCell>
              <TableCell
                colSpan={2}
                className="w-[215px] border-[0.5px]"
              ></TableCell>
              <TableCell className="w-[130px] border-[0.5px] text-right ">
                {formatNumber(
                  currentOrder.items.reduce(
                    (acc, b) => (acc += b.quantity * b.unitPriceBase),
                    0
                  ),
                  2
                )}
              </TableCell>
              <TableCell colSpan={3}></TableCell>
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
            {currentOrder.items?.map((item) => (
              <OrderItemCard
                key={item.productId}
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
                % Desconto: R${" "}
                {formatNumber(
                  orderTotal * (currentOrder.discountPercent / 100),
                  2
                )}
              </div>
              <div className="text-xl font-bold">
                Total com Desconto: R${" "}
                {formatNumber(
                  orderTotal * (1 - currentOrder.discountPercent / 100),
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
