import { ProductImage } from "@/components/app/product-image";
import { FormInputQty } from "@/components/form/form-qty-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/datetime-utils";
import { cn } from "@/lib/utils";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import { CalendarIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useOrder } from "../-hooks/use-order";
import { formatNumber } from "@/lib/number-utils";
import { api } from "@/lib/api";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { AvailabilityInfo } from "./availability-info";
import { getAvailabilityColor } from "../-utils/order-utils";

interface Props {
  data: OrderItemModel;
  className?: string;
}

export const OrderItemCard = ({ data, className }: Props) => {
  const { onUpdateItem, onRemoveItem, currentOrder } = useOrder();

  const handleUpdateQuantity = async (newQuantity: number | undefined) => {
    if (!newQuantity) {
      onRemoveItem(data);
      return;
    }

    // chama a api que calcula data de entrega
    var params = {
      orderId: currentOrder.id,
      customerAbbreviation: currentOrder.customerAbbreviation,
      productId: data.productId,
      quantity: newQuantity,
    };

    const { data: response } = await api.post(
      `/stock/caculate-delivery-date`,
      params
    );

    const updatedItem = {
      ...data,
      quantity: Number(newQuantity),
      deliveryDate: response.estimatedDate,
      availability: response.availbility,
    };
    console.log("UPdated", updatedItem);
    onUpdateItem(updatedItem);
  };

  const handleRemoveItem = () => {
    onRemoveItem(data);
  };

  return (
    <div
      className={cn(
        "flex flex-col border-neutral-100  border-x border-b first:border-t-0 last:border-b-0",
        className
      )}
    >
      {/* Order Items */}
      <div className="">
        <Card
          key={`${data.sequence}_${data.productId}`}
          className="overflow-hidden rounded-none border-none"
        >
          <CardContent className="px-6 w-full">
            <div className="grid grid-cols-[200px_1fr]">
              {/* Item Image */}
              <div className="flex-shrink-0">
                <ProductImage productId={data.productId} alt={""} />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                    {data.product?.id}
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleRemoveItem()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 underline"
                  >
                    Remover
                  </Button>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {data.product?.description}
                </p>
                <div className="text-lg font-bold text-gray-900">
                  Preço Sugerido: R$ {formatNumber(data.unitPriceSuggest, 2)}
                </div>

                <div className="text-lg font-bold text-gray-900">
                  Preço c/Desconto: R$ {formatNumber(data.unitPriceBase, 2)}
                </div>

                {/* Price and Quantity Controls */}
                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg gap-x-4">
                      <FormInputQty
                        min={1}
                        value={data.quantity}
                        onValueChange={(e) => handleUpdateQuantity(e)}
                        minusSlot={<MinusIcon className="size-3" />}
                        plusSlot={<PlusIcon className="size-3" />}
                      />
                    </div>
                  </div>
                  <div className="flex items-center font-bold text-lg">
                    Total: R${" "}
                    {formatNumber(data.quantity * data.unitPriceBase, 2)}
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <AppTooltip
                    message={<AvailabilityInfo />}
                    className="bg-neutral-100 text-black shadow-lg border"
                    indicatorClassName="fill-neutral-100 bg-neutral-100 shadow"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "select-none mr-4",
                        getAvailabilityColor(data.availability)
                      )}
                    >
                      {data.availability}
                    </Badge>
                  </AppTooltip>
                  <div className="flex flex-wrap gap-3 items-center justify-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        Prev. Entrega: {formatDate(data.deliveryDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
