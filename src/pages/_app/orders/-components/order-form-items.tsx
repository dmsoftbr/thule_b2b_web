import { ProductsCombo } from "@/components/app/products-combo";
import { Label } from "@/components/ui/label";
import { OrderItemCard } from "./order-item-card";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderSearchProductModal } from "./order-search-product-modal";
import { toast } from "sonner";
import { EmptyOrder } from "./empty-order";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import { NEW_ORDER_ITEM_EMPTY } from "../-utils/order-utils";
import { api } from "@/lib/api";
import { OrderItemTable } from "./order-item-table";
import { useOrder } from "../-context/order-context";
import { SearchCombo } from "@/components/ui/search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { StretchHorizontalIcon, Table2Icon } from "lucide-react";
import { AppTooltip } from "@/components/layout/app-tooltip";

import type { OrderItemModel } from "@/models/orders/order-item-model";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import type { ProductModel } from "@/models/product.model";

export const OrderFormItems = () => {
  const { order, addItem, mode } = useOrder();
  const [showCard, setShowCard] = useState(true);
  const { showAppDialog } = useAppDialog();
  const [priceTable, setPriceTable] = useState<PriceTableModel>(
    order.customer?.priceTables[0] ?? {
      id: "PrBase",
      isOutlet: false,
      name: "PrBase",
      validFrom: new Date(2000, 1, 1),
      validTo: new Date(2072, 12, 31),
      zeroDiscount: false,
      isActive: true,
      isException: false,
      portalName: "",
    },
  );
  const isEditing = mode == "NEW" || mode == "EDIT";

  const hasCustomer = order.customer;

  if (!hasCustomer) {
    return (
      <div className="w-full p-2 flex flex-col items-center min-h-[100px]">
        <div className="my-4">
          Selecione o Cliente para poder selecionar os Produtos
        </div>
      </div>
    );
  }

  const handleAddItem = async (product: ProductModel | undefined) => {
    if (!priceTable) {
      toast.warning("Selecione a tabela de Preço");
      return;
    }
    if (!product) return;

    if (product.orderMessage) {
      await showAppDialog({
        message: product.orderMessage,
        title: "ATENÇÃO",
        type: "warning",
        buttons: [
          {
            text: "OK",
            autoClose: true,
          },
        ],
        onClose: async () => {
          continueAddItem(product);
        },
      });
    } else {
      continueAddItem(product);
    }
  };

  async function continueAddItem(product: ProductModel) {
    if (
      order.items &&
      order.items?.findIndex(
        (f) => f.productId.toLowerCase() === product.id.toLowerCase(),
      ) >= 0
    ) {
      toast.warning("Produto já consta no pedido!");
      return;
    }

    // chama a
    // api que calcula data de entrega

    var params = {
      orderId: order.id,
      customerAbbreviation: order.customerAbbreviation,
      productId: product.id,
      quantity: 1,
    };
    const { data: deliveryData } = await api.post(
      `/stock/caculate-delivery-date`,
      params,
    );

    // chama api de matriz de cfop
    var paramsCFOP = {
      branchId: order.branchId,
      customerAbbreviation: order.customer?.abbreviation,
      productId: product.id,
      fiscalOperationId: order.customer?.fiscalOperationId,
    };
    const { data: cfopData } = await api.post(
      `/order-items/matriz-cfop-item`,
      paramsCFOP,
    );

    const newOrderItem: OrderItemModel = {
      ...NEW_ORDER_ITEM_EMPTY,
      ...product,
      productId: product.id,
      product: product,
      deliveryDate: deliveryData.estimatedDate,
      availability: deliveryData.availbility,
      inputPrice: product.unitPriceInTable,
      suggestPrice: product.suggestUnitPrice,
      priceTablePrice: product.unitPriceInTable,
      grossItemValue: product.unitPriceInTable * 1,
      orderQuantity: 1,
      sequence: order.items.length + 10,
      taxes: [],
      priceTable,
      priceTableId: priceTable.id,
      costValue: 0,
      fiscalOperationId: cfopData,
    };

    addItem(newOrderItem);
    toast.success("Produto adicionado ao pedido", {
      duration: 1000,
    });
  }

  const orderTotal = order.items.reduce(
    (acc, b) => acc + b.inputPrice * b.orderQuantity,
    0,
  );

  const sortedItems = order.items.sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="w-full p-2 container flex flex-col items-center">
      <div className="flex gap-x-4 mb-2 container w-full">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex gap-x-2 w-full items-end">
            {order.orderClassificationId < 6 && isEditing ? (
              <>
                <div className="flex-0 form-group">
                  <Label>Tabela de Preço</Label>
                  <SearchCombo
                    className="h-9.5 min-w-[200px]"
                    defaultValue={order.customer?.priceTables[0].id}
                    staticItems={convertArrayToSearchComboItem(
                      order.customer?.priceTables ?? [],
                      "id",
                      "portalName",
                    )}
                    onSelectOption={(opt) => setPriceTable(opt[0].extra)}
                  />
                </div>
                <div className="flex-1 form-group">
                  <Label>Pesquisar Produto para Adicionar</Label>
                  <ProductsCombo
                    onSelect={handleAddItem}
                    priceTableId={order.customer?.priceTables[0].id ?? ""}
                    customerId={order.customerId}
                    closeOnSelect
                  />
                </div>
                <OrderSearchProductModal initialPriceTable={priceTable} />
              </>
            ) : (
              <div></div>
            )}
            <div className="flex items-center gap-x-1">
              <AppTooltip
                message="Ver em Cards"
                className="bg-emerald-700"
                indicatorClassName="!bg-emerald-700 fill-emerald-700"
              >
                <button
                  type="button"
                  onClick={() => setShowCard(true)}
                  className={cn(
                    "flex items-center justify-center p-1 bg-neutral-50 rounded-md size-9 border-neutral-200 border cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors",
                    showCard && "bg-emerald-500 border-0 text-white",
                  )}
                >
                  <StretchHorizontalIcon className="size-4" />
                </button>
              </AppTooltip>
              <AppTooltip
                message="Ver em Tabela"
                className="bg-emerald-700"
                indicatorClassName="!bg-emerald-700 fill-emerald-700"
              >
                <button
                  type="button"
                  onClick={() => setShowCard(false)}
                  className={cn(
                    "flex items-center justify-center p-1 bg-neutral-50 rounded-md size-9 border-neutral-200 border cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors",
                    !showCard && "bg-emerald-500 border-0 text-white",
                  )}
                >
                  <Table2Icon className="size-4" />
                </button>
              </AppTooltip>
            </div>
          </div>
        </div>
      </div>
      {!showCard && <OrderItemTable />}
      {showCard && (
        <div
          className={cn(
            "grid grid-cols-[70%_30%] border-y w-full",
            !order.items && "grid-cols-1 border-0",
          )}
        >
          <ScrollArea
            className={""}
            style={{ height: "calc(100vh - 330px)" }}
            type="always"
          >
            {!order.items?.length && <EmptyOrder />}
            {sortedItems.map((item: OrderItemModel, index) => (
              <OrderItemCard
                key={`${item.productId}_${index}`}
                data={item}
                className="even:bg-neutral-300"
              />
            ))}
          </ScrollArea>
          {sortedItems && (
            <div className="border-x  flex items-center justify-center flex-col">
              <div className="flex items-center text-lg font-semibold">
                Total {order.isBudget ? "da Simulação" : "do Pedido"}: R${" "}
                {formatNumber(orderTotal, 2)}
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="text-xs font-semibold bg-neutral-700 text-white rounded px-1.5 py-0.5 flex items-center justify-center ml-2">
                  {`(${order.items.length}) ${order.items.length > 1 ? "itens" : "item"}`}
                </div>
                <div className="text-xs font-semibold bg-neutral-500 text-white rounded px-1.5 py-0.5 flex items-center justify-center ml-2">
                  {`(${order.items.reduce((acc, item) => (acc += item.orderQuantity), 0)}) qtde total`}
                </div>
              </div>
              <div className="text-green-600 font-semibold">
                Desconto: R${" "}
                {formatNumber(orderTotal * (order.discountPercentual / 100), 2)}
              </div>
              <div className="text-xl font-bold">
                Total com Desconto: R${" "}
                {formatNumber(
                  orderTotal * (1 - order.discountPercentual / 100),
                  2,
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
