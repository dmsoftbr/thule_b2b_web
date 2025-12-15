import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/number-utils";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import { OrderItemTableRow } from "./order-item-table-row";
import { useOrder } from "../-context/order-context";

export const OrderItemTable = () => {
  const { order, getTotalOrderWithDiscount } = useOrder();

  return (
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
            <span>Sugerido Cons.</span>
          </TableHead>
          <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
            <span>Preço</span>
            <span>Tabela</span>
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
        {order.items.length == 0 && (
          <tr className="h-10">
            <td
              className="flex items-center justify-center h-10 border"
              colSpan={9}
            >
              Sem Itens no Pedido
            </td>
          </tr>
        )}
        {order.items?.map((item: OrderItemModel, index: number) => (
          <OrderItemTableRow key={index} item={item} />
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
            {order.items?.length}
          </TableHead>
          <TableHead
            colSpan={2}
            className="w-[240px] border-[0.5px]"
          ></TableHead>
          <TableHead className="w-[120px] border-[0.5px] text-right  flex items-center justify-end">
            {formatNumber(getTotalOrderWithDiscount(), 2)}
          </TableHead>
          <TableHead className="w-[220px] border-r"></TableHead>
          <TableHead className="w-[17px]"></TableHead>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
