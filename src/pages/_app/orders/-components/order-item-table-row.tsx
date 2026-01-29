import type { OrderItemModel } from "@/models/orders/order-item-model";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductImage } from "@/components/app/product-image";
import { FormInputQty } from "@/components/form/form-qty-input";
import { formatNumber } from "@/lib/number-utils";
import { Badge } from "@/components/ui/badge";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAvailabilityColor } from "../-utils/order-utils";
import { api } from "@/lib/api";
import { AvailabilityInfo } from "./availability-info";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { useOrder } from "../-context/order-context";

interface Props {
  item: OrderItemModel;
}

export const OrderItemTableRow = ({ item }: Props) => {
  const { order, removeItem, updateItem, mode } = useOrder();

  const isEditing = mode == "NEW" || mode == "EDIT";

  const handleUpdateQuantity = async (newQuantity: number | undefined) => {
    if (!newQuantity) {
      removeItem(item);
      return;
    }

    // chama a api que calcula data de entrega
    var params = {
      orderId: order.id,
      customerAbbreviation: order.customerAbbreviation,
      productId: item.productId,
      quantity: newQuantity,
    };

    const { data: response } = await api.post(
      `/stock/caculate-delivery-date`,
      params,
    );

    const updatedItem = {
      ...item,
      orderQuantity: Number(newQuantity),
      deliveryDate: response.estimatedDate,
      availability: response.availbility,
    };

    updateItem(updatedItem);
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
          plusSlot={<PlusIcon className="size-3" />}
          minusSlot={<MinusIcon className="size-3" />}
          disabled={!isEditing}
          value={item.orderQuantity}
          onValueChange={(value) => handleUpdateQuantity(value ?? 0)}
        />
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(item.suggestPrice, 2)}
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(item.inputPrice, 2)}
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(item.inputPrice * item.orderQuantity, 2)}
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
              getAvailabilityColor(item.availability),
            )}
          >
            {item.availability}
          </Badge>
        </AppTooltip>
      </TableCell>

      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(
          ((item.suggestPrice - item.priceTablePrice) /
            (item.suggestPrice == 0 ? 1 : item.suggestPrice)) *
            100,
          2,
        )}
        %
      </TableCell>
      <TableCell className="w-[120px] border-r text-right">
        {formatNumber(
          ((item.suggestPrice - item.priceTablePrice) /
            (item.priceTablePrice == 0 ? 1 : item.priceTablePrice)) *
            100,
          2,
        )}
        %
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
              onClick={() => removeItem(item)}
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
