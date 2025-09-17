import { ProductImage } from "@/components/app/product-image";
import { FormInputQty } from "@/components/form/form-qty-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/datetime-utils";
import { cn } from "@/lib/utils";
import type { OrderItemModel } from "@/models/order-item-model";
import { CalendarIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useOrder } from "../-hooks/use-order";
import { formatNumber } from "@/lib/number-utils";
import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  data: OrderItemModel;
  className?: string;
}

export const OrderItemTableRow = ({ data, className }: Props) => {
  const { onUpdateItem, onRemoveItem } = useOrder();

  const handleUpdateQuantity = (newQuantity: number | undefined) => {
    if (!newQuantity) {
      onRemoveItem(data);
    }
    const updatedItem = { ...data, quantity: Number(newQuantity) };
    onUpdateItem(updatedItem);
  };

  const handleRemoveItem = () => {
    onRemoveItem(data);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "C":
        return "bg-green-100 text-green-800 border-green-200";
      case "B":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "B2":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
