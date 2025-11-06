import type { OrderItemModel } from "@/models/orders/order-item-model";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductImage } from "@/components/app/product-image";
import { FormInputQty } from "@/components/form/form-qty-input";
import { formatNumber } from "@/lib/number-utils";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAvailabilityColor } from "../-utils/order-utils";
import { useOrder } from "../-hooks/use-order";
import { api } from "@/lib/api";
import { AvailabilityInfo } from "./availability-info";
import { AppTooltip } from "@/components/layout/app-tooltip";

interface Props {
  item: OrderItemModel;
  isEditing?: boolean;
}

export const OrderItemTableRow = ({ item, isEditing }: Props) => {
  const { currentOrder, onRemoveItem, onUpdateItem } = useOrder();

  const handleUpdateQuantity = async (newQuantity: number | undefined) => {
    if (!newQuantity) {
      onRemoveItem(item);
      return;
    }

    // chama a api que calcula data de entrega
    var params = {
      orderId: currentOrder.id,
      customerAbbreviation: currentOrder.customerAbbreviation,
      productId: item.productId,
      quantity: newQuantity,
    };

    const { data: response } = await api.post(
      `/stock/caculate-delivery-date`,
      params
    );

    const updatedItem = {
      ...item,
      quantity: Number(newQuantity),
      deliveryDate: response.estimatedDate,
      availability: response.availbility,
    };

    onUpdateItem(updatedItem);
  };

  return (
    <TableRow className="flex w-full even:bg-muted">
      <TableCell className="border-r border-l p-1 w-[72px]">
        <ProductImage
          productId={item.productId}
          alt={item.productId}
          isThumb
          expandOnClick
          className="hover:bg-neutral-100 cursor-pointer max-w-[64px] max-h-[64px]"
        />
      </TableCell>
      <TableCell className="flex-1 border-r flex flex-col">
        <span className="font-semibold text-blue-600">{item.productId}</span>
        <span>{item.product?.description}</span>
      </TableCell>
      <TableCell className="border-r text-right w-[160px]">
        <FormInputQty
          value={item.quantity}
          onValueChange={(value) => handleUpdateQuantity(value ?? 0)}
        />
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(item.unitPriceSuggest, 2)}
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(item.unitPriceBase, 2)}
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(item.unitPriceBase * item.quantity, 2)}
      </TableCell>
      <TableCell className="w-[120px] border-r flex-wrap ">
        {format(item.deliveryDate, "dd/MM/yyyy")}{" "}
        <AppTooltip
          message={<AvailabilityInfo />}
          className="bg-neutral-100 text-black shadow-lg border"
          indicatorClassName="fill-neutral-100 bg-neutral-100 shadow"
        >
          <Badge
            variant="outline"
            className={cn(
              "select-none mr-4",
              getAvailabilityColor(item.availability)
            )}
          >
            {item.availability}
          </Badge>
        </AppTooltip>
      </TableCell>

      <TableCell className="border-r w-[100px]">
        {isEditing && (
          <div className="flex flex-wrap gap-1.5">
            {/* <Button size="icon" variant="blue">
              <PencilIcon />
            </Button> */}
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onRemoveItem(item)}
            >
              <TrashIcon />
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell className="p-0 w-[17px] border-r"></TableCell>
    </TableRow>
  );
};
