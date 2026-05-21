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
import { OrderItemTaxesModal } from "./order-item-taxes-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  item: OrderItemModel;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const OrderItemTableRow = ({ item, isSelected, onSelect }: Props) => {
  const { order, removeItem, updateItem, mode } = useOrder();

  const isEditing = mode == "NEW" || mode == "EDIT";

  // Preço unitário c/Desconto:
  //   (InputPrice / (1 + AliqIPI/100)) * (1 − %DescCliente/100)
  //   + ValorIPI + ValorICMS-ST
  // Desembute o IPI já contido no preço, aplica o desconto do cliente sobre o
  // valor desembutido e soma de volta IPI e ICMS-ST como valores absolutos.
  // Reaproveitado nos cálculos de Total, Markup e Margem.
  const getUnitPriceWithDiscount = () => {
    const findTax = (name: string) =>
      item.taxes?.find((t) => (t.taxName ?? "").trim().toUpperCase() === name);
    const ipi = findTax("IPI");
    const icmsSt = findTax("ICMS-ST");
    const ipiAliquota = ipi?.taxPercentual ?? 0;
    const ipiValor = ipi?.taxValue ?? 0;
    const icmsStValor = icmsSt?.taxValue ?? 0;

    const customerDiscount =
      order.discountPercentual ?? order.customer?.discountPercent ?? 0;
    const discountFactor = 1 - customerDiscount / 100;
    const desembutidoIpi = item.inputPrice / (1 + ipiAliquota / 100);
    const desembutidoComDesconto = desembutidoIpi * discountFactor;

    // IPI e ICMS-ST escalam linearmente com a base de cálculo (preço com
    // desconto), então aplicamos o mesmo fator de desconto sobre os valores.
    return (
      desembutidoComDesconto +
      ipiValor * discountFactor +
      icmsStValor * discountFactor
    );
  };

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
    <TableRow
      onClick={onSelect}
      className={cn(
        "flex w-full even:bg-muted cursor-pointer hover:bg-neutral-200",
        isSelected && "bg-blue-100 hover:bg-blue-100 even:bg-blue-100",
      )}
    >
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
        <span className="break-normal whitespace-normal">
          {item.product?.description}
        </span>
      </TableCell>
      <TableCell className="border-r text-right w-[155px]">
        <FormInputQty
          plusSlot={<PlusIcon className="size-3" />}
          minusSlot={<MinusIcon className="size-3" />}
          disabled={!isEditing}
          value={item.orderQuantity}
          onValueChange={(value) => handleUpdateQuantity(value ?? 0)}
        />
      </TableCell>
      <TableCell className="w-[110px] border-r text-right">
        {formatNumber(item.suggestPrice, 2)}
      </TableCell>
      <TableCell className="w-[110px] border-r text-right">
        {formatNumber(item.inputPrice, 2)}
      </TableCell>
      <TableCell className="w-[140px] border-r text-right">
        {item.isLoadingTaxes ? (
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        ) : (
          (() => {
            // Oculta tributos da reforma (CBS/IBS, incluindo variantes
            // "IBS Mun" / "IBS UF") na soma exibida — mantidos no state para
            // envio ao backend; apenas não aparecem ao usuário.
            const hiddenPrefixes = ["CBS", "IBS"];
            const visibleTaxes = (item.taxes ?? []).filter((t) => {
              const name = (t.taxName ?? "").trim().toUpperCase();
              return !hiddenPrefixes.some(
                (p) => name === p || name.startsWith(`${p} `),
              );
            });
            // Impostos seguem a base de cálculo com desconto do cliente.
            const customerDiscount =
              order.discountPercentual ?? order.customer?.discountPercent ?? 0;
            const discountFactor = 1 - customerDiscount / 100;
            const total =
              visibleTaxes.reduce((acc, t) => acc + (t.taxValue ?? 0), 0) *
              item.orderQuantity *
              discountFactor;
            if (visibleTaxes.length === 0) {
              return <span className="text-neutral-400">—</span>;
            }
            return (
              <div className="flex items-center justify-end gap-2 tabular-nums">
                <span>R$ {formatNumber(total, 2)}</span>
                <OrderItemTaxesModal
                  productId={item.productId}
                  taxes={item.taxes}
                  itemValue={item.inputPrice * discountFactor}
                />
              </div>
            );
          })()
        )}
      </TableCell>

      <TableCell className="w-[120px] border-r text-right">
        {item.isLoadingTaxes ? (
          <div className="flex justify-end">
            <Skeleton className="h-4 w-20" />
          </div>
        ) : (
          formatNumber(getUnitPriceWithDiscount() * item.orderQuantity, 2)
        )}
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
      <TableCell className="w-[100px] border-r text-right">
        {item.isLoadingTaxes ? (
          <div className="flex justify-end">
            <Skeleton className="h-4 w-14" />
          </div>
        ) : (
          <>
            {formatNumber(
              (1 -
                getUnitPriceWithDiscount() /
                  (item.suggestPrice == 0 ? 1 : item.suggestPrice)) *
                100,
              2,
            )}
            %
          </>
        )}
      </TableCell>

      <TableCell className="w-[100px] border-r text-right">
        {item.isLoadingTaxes ? (
          <div className="flex justify-end">
            <Skeleton className="h-4 w-14" />
          </div>
        ) : (
          formatNumber(item.suggestPrice / getUnitPriceWithDiscount(), 2)
        )}
      </TableCell>

      <TableCell className="border-r w-[60px]">
        {isEditing && (
          <div className="flex flex-wrap gap-1.5 justify-center">
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
