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
import { Skeleton } from "@/components/ui/skeleton";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { InfoIcon } from "lucide-react";

export const OrderItemTable = () => {
  const { order, isBudget } = useOrder();
  const anyItemLoadingTaxes = order.items.some((i) => i.isLoadingTaxes);

  // Soma do "Total c/Desconto" usando a mesma fórmula da linha:
  //   (InputPrice / (1 + AliqIPI/100)) * (1 − %DescCliente/100)
  //   + ValorIPI + ValorICMS-ST, multiplicado pela quantidade.
  const findTax = (item: OrderItemModel, name: string) =>
    item.taxes?.find((t) => (t.taxName ?? "").trim().toUpperCase() === name);
  const customerDiscount = order.customer?.discountPercent ?? 0;
  const grandTotalWithDiscount = order.items.reduce((acc, item) => {
    const ipi = findTax(item, "IPI");
    const icmsSt = findTax(item, "ICMS-ST");
    const ipiAliquota = ipi?.taxPercentual ?? 0;
    const ipiValor = ipi?.taxValue ?? 0;
    const icmsStValor = icmsSt?.taxValue ?? 0;
    const desembutidoIpi = item.inputPrice / (1 + ipiAliquota / 100);
    const desembutidoComDesconto =
      desembutidoIpi * (1 - customerDiscount / 100);
    const unit = desembutidoComDesconto + ipiValor + icmsStValor;
    return acc + unit * item.orderQuantity;
  }, 0);
  const totalQuantity = order.items.reduce(
    (acc, item) => acc + item.orderQuantity,
    0,
  );

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
          <TableHead className="w-[155px] border flex items-center text-xs text-black">
            Qtde
          </TableHead>
          <TableHead className="w-[110px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
            <span>Preço Venda</span>
            <span>Sugerido Unit.</span>
          </TableHead>
          <TableHead className="w-[110px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
            <span>Preço</span>
            <span>Compra Unit</span>
          </TableHead>
          <TableHead className="w-[140px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
            <span>Impostos</span>
          </TableHead>
          <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
            <span>Total Compra</span>
            <span>c/ Desconto</span>
          </TableHead>
          <TableHead className="w-[120px] border flex items-center justify-center text-center flex-col break-words text-xs text-black">
            Prev. Entrega
          </TableHead>

          <TableHead className="w-[100px] border text-xs text-black">
            <div className="flex items-center justify-center gap-1 h-full">
              <span>Margem</span>
              <AppTooltip
                message={
                  <div className="text-xs leading-snug max-w-[260px]">
                    <div className="font-semibold mb-1">Margem (%)</div>
                    <div>
                      (1 − Preço de Compra c/ Desconto / Preço de Venda
                      Sugerido) × 100
                    </div>
                    {/* <div className="mt-2 text-neutral-300">
                      PreçoCompraComDesc = (PreçoCompra / (1 + AlíqIPI/100)) ×
                      (1 − %DescCliente/100) + ValorIPI + ValorICMS-ST
                    </div> */}
                  </div>
                }
              >
                <InfoIcon className="size-3 text-blue-700 cursor-help" />
              </AppTooltip>
            </div>
          </TableHead>
          <TableHead className="w-[100px] border text-xs text-black">
            <div className="flex items-center justify-center gap-1 h-full">
              <span>Markup</span>
              <AppTooltip
                message={
                  <div className="text-xs leading-snug max-w-[260px]">
                    <div className="font-semibold mb-1">Markup</div>
                    <div>
                      Preço de Venda Sugerido / Preço de Compra c/ Desconto
                    </div>
                    {/* <div className="mt-2 text-neutral-300">
                      PreçoCompraComDesc = (PreçoCompra / (1 + AlíqIPI/100)) ×
                      (1 − %DescCliente/100) + ValorIPI + ValorICMS-ST
                    </div> */}
                  </div>
                }
              >
                <InfoIcon className="size-3 text-blue-700 cursor-help" />
              </AppTooltip>
            </div>
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
              Sem Itens {isBudget ? "na Simulação" : "no Pedido"}
            </td>
          </tr>
        )}
        {order.items?.map((item: OrderItemModel, index: number) => (
          <OrderItemTableRow key={index} item={item} />
        ))}
      </TableBody>
      <TableFooter className="flex w-full">
        <TableRow className="flex w-full bg-neutral-300 align-middle text-sm hover:bg-neutral-300 font-semibold">
          {/* Imagem (72) + Produto (flex-1) — label "Total" */}
          <TableHead className="w-[72px] border-[0.5px] flex items-center justify-center">
            Total
          </TableHead>
          <TableHead className="flex-1 border-[0.5px]"></TableHead>
          {/* Qtde (155) — soma das quantidades */}
          <TableHead className="w-[155px] border-[0.5px] flex items-center justify-end pr-2">
            {totalQuantity}
          </TableHead>
          {/* Preço Sugerido (110) + Preço Tabela (110) + Impostos (140) = 360 */}
          <TableHead className="w-[360px] border-[0.5px]"></TableHead>
          {/* Total c/Desconto (120) — soma c/ fórmula da linha */}
          <TableHead className="w-[120px] border-[0.5px] flex items-center justify-end pr-2 tabular-nums">
            {anyItemLoadingTaxes ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              formatNumber(grandTotalWithDiscount, 2)
            )}
          </TableHead>
          {/* Prev. Entrega (120) + Margem (100) + Markup (100) + Ações (100) = 420 */}
          <TableHead className="w-[420px] border-[0.5px]"></TableHead>
          <TableHead className="w-[17px]"></TableHead>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
