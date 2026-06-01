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
import { calcOrderItemsTotalWithDiscount } from "../-utils/order-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { InfoIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

export const OrderItemTable = () => {
  const { order, isBudget } = useOrder();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const anyItemLoadingTaxes = order.items.some((i) => i.isLoadingTaxes);

  // O corpo da tabela rola na vertical e a barra de rolagem consome largura
  // interna (scrollbar-gutter: stable). Cabeçalho e rodapé não rolam, então
  // medimos essa largura e a reservamos como padding neles, mantendo as linhas
  // de grade das colunas alinhadas entre header/body/footer.
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    setScrollbarWidth(el.offsetWidth - el.clientWidth);
  }, [order.items.length]);

  // Soma do "Total c/Desconto" — fonte única em order-utils (regra I24).
  const grandTotalWithDiscount = calcOrderItemsTotalWithDiscount(order);
  const totalQuantity = order.items.reduce(
    (acc, item) => acc + item.orderQuantity,
    0,
  );

  return (
    <Table className="w-full table-fixed text-xs flex flex-col">
      <TableHeader className="flex">
        <TableRow
          className="flex w-full hover:bg-neutral-300 bg-neutral-300"
          style={{ paddingRight: scrollbarWidth }}
        >
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
          <TableHead className="w-[60px] border flex items-center justify-center text-xs text-black">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody
        ref={bodyRef}
        className="flex flex-col overflow-y-auto w-full"
        style={{ maxHeight: "calc(100vh - 400px)", scrollbarGutter: "stable" }}
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
          <OrderItemTableRow
            key={index}
            item={item}
            isSelected={selectedIndex === index}
            onSelect={() =>
              setSelectedIndex(selectedIndex === index ? null : index)
            }
          />
        ))}
      </TableBody>
      <TableFooter className="flex w-full sticky bottom-0 z-10">
        <TableRow
          className="flex w-full bg-neutral-300 align-middle text-sm hover:bg-neutral-300 font-semibold"
          style={{ paddingRight: scrollbarWidth }}
        >
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
          {/* Prev. Entrega (120) + Margem (100) + Markup (100) + Ações (60) = 380 */}
          <TableHead className="w-[380px] border-[0.5px]"></TableHead>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
