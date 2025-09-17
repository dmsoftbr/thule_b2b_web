import { cn } from "@/lib/utils";
import type { OrderItemModel } from "@/models/order-item-model";
import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  data: OrderItemModel;
  className?: string;
}

export const OrderItemTableRow = ({ data, className }: Props) => {
  return (
    <TableRow className={cn("", className)}>
      <TableCell>{data.productId}</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
