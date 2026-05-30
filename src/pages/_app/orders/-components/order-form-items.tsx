import {
  ProductsCombo,
  type ProductsComboHandle,
} from "@/components/app/products-combo";
import { Label } from "@/components/ui/label";
import { OrderItemCard } from "./order-item-card";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderSearchProductModal } from "./order-search-product-modal";
import { toast } from "sonner";
import { EmptyOrder } from "./empty-order";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import {
  NEW_ORDER_ITEM_EMPTY,
  calcOrderItemsTotalWithDiscount,
  calcSingleProductTaxes,
  getItemDiscountFactor,
} from "../-utils/order-utils";
import { api } from "@/lib/api";
import * as uuid from "uuid";
import { OrderItemTable } from "./order-item-table";
import { useOrder } from "../-context/order-context";
import { SearchCombo } from "@/components/ui/search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { StretchHorizontalIcon, Table2Icon } from "lucide-react";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { Skeleton } from "@/components/ui/skeleton";

import type { OrderItemModel } from "@/models/orders/order-item-model";
import type { OrderModel } from "@/models/orders/order-model";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import type { ProductModel } from "@/models/product.model";
import type { SkuMessageModel } from "@/models/registrations/sku-message.model";
import type { Dispatch, SetStateAction } from "react";

export const OrderFormItems = () => {
  const { order, addItem, mode, setOrder } = useOrder();
  const [showCard, setShowCard] = useState(false);
  // Em telas < md (Tailwind: 768px) a tabela não cabe — força a visão em
  // Card. matchMedia reage ao resize da janela em tempo real.
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const useCardView = isSmallScreen || showCard;
  const { showAppDialog } = useAppDialog();
  const productsComboRef = useRef<ProductsComboHandle>(null);
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

    if (product.isBlockedByException) {
      const allowedBranch = product.allowedExceptionBranches?.[0];
      await showAppDialog({
        title: "ATENÇÃO",
        message: allowedBranch
          ? `Para comprar esse produto, altere o estabelecimento para ${allowedBranch}`
          : "Produto não disponível para venda neste estabelecimento.",
        type: "warning",
        buttons: [{ text: "OK", autoClose: true }],
      });
      return;
    }

    // Regra de grupo de desconto: assim que o pedido tem um item de grupo de
    // desconto, ele fica "preso" a esse grupo (tabela de exceção). Não permite
    // incluir produto que não pertence ao grupo selecionado — seguindo a regra
    // de nó pai marcado/filho desmarcado, já resolvida no backend (exceptionTableId).
    const orderGroupId =
      order.items.find((it) => it.exceptionMarginPercent != null)
        ?.exceptionTableId ?? null;
    if (orderGroupId && product.exceptionTableId !== orderGroupId) {
      await showAppDialog({
        title: "ATENÇÃO",
        message: "Altere o estabelecimento para comprar este produto",
        type: "warning",
        buttons: [{ text: "OK", autoClose: true }],
      });
      return;
    }

    const { data } = await api.get<SkuMessageModel | null>(
      `/registrations/sku-messages/id/${encodeURIComponent(product.id)}`,
    );

    if (data) {
      await showAppDialog({
        message: data.message,
        title: "ATENÇÃO",
        type: "warning",
        buttons: [
          {
            text: "OK",
            autoClose: true,
          },
        ],
      });
    }

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
      toast.warning(
        `Produto já consta ${order.isBudget ? "na simulação" : "no pedido"}!`,
      );
      return;
    }

    // Garante que o cliente está no state. Sem cliente, não há como definir
    // estabelecimento, abreviação nem natureza de operação.
    if (!order.customer) {
      toast.warning("Selecione o cliente antes de adicionar produtos.");
      return;
    }

    // Respeita o estabelecimento escolhido pelo usuário no cabeçalho. Só faz
    // fallback para o branch do cliente (ou "1") quando o pedido ainda está sem
    // estabelecimento definido. Como ~60% dos clientes na base estão com
    // BranchId vazio, o "1" garante um valor válido (mesma convenção usada em
    // finish-order-modal.tsx).
    const effectiveBranchId = order.branchId || order.customer.branchId || "1";
    if (order.branchId !== effectiveBranchId) {
      setOrder({ ...order, branchId: effectiveBranchId });
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

    const fiscalOperationForOrder = order.customer.fiscalOperationId;

    // chama api de matriz de cfop — usa effectiveBranchId direto (o setOrder
    // acima é assíncrono e a closure ainda enxergaria o valor antigo).
    var paramsCFOP = {
      branchId: effectiveBranchId,
      customerAbbreviation: order.customer.abbreviation,
      productId: product.id,
      fiscalOperationId: fiscalOperationForOrder,
    };
    const { data: cfopData } = await api.post(
      `/order-items/matriz-cfop-item`,
      paramsCFOP,
    );

    const newItemId = uuid.v4();
    const newSequence = order.items.length + 10;

    const newOrderItem: OrderItemModel = {
      ...NEW_ORDER_ITEM_EMPTY,
      ...product,
      id: newItemId,
      productId: product.id,
      product: product,
      deliveryDate: deliveryData.estimatedDate,
      availability: deliveryData.availbility,
      inputPrice: product.unitPriceInTable,
      suggestPrice: product.suggestUnitPrice,
      priceTablePrice: product.unitPriceInTable,
      exceptionMarginPercent: product.exceptionMarginPercent ?? null,
      exceptionTableId: product.exceptionTableId ?? null,
      grossItemValue: product.unitPriceInTable * 1,
      orderQuantity: 1,
      sequence: newSequence,
      taxes: [],
      isLoadingTaxes: true,
      priceTable,
      priceTableId: priceTable.id,
      costValue: 0,
      fiscalOperationId: cfopData,
    };

    addItem(newOrderItem);
    // Guarda o id final atribuído pelo addItem (que muta item.id = uuid.v4()).
    const finalItemId = newOrderItem.id;

    // Recupera os impostos do produto em segundo plano. Se falhar, o item já
    // foi adicionado sem impostos — eles serão recalculados na finalização.
    // Na adição de item, o pedido ainda pode não ter condição de pagamento
    // escolhida. Usa a condição padrão do cliente para o cálculo de impostos.
    const paymentConditionForTaxes =
      order.customer?.paymentConditionId ?? order.paymentConditionId;

    console.log("[taxes] solicitando cálculo", {
      productId: product.id,
      paymentConditionId: paymentConditionForTaxes,
      branchId: effectiveBranchId,
      customerId: order.customerId,
    });
    calcSingleProductTaxes({
      branchId: effectiveBranchId,
      customerId: order.customerId,
      paymentConditionId: paymentConditionForTaxes,
      freightValue: order.freightValue,
      discountPercentual: order.discountPercentual,
      fiscalOperationId: fiscalOperationForOrder ?? "",
      product: {
        sequence: newSequence,
        productId: product.id,
        referenceCode: product.referenceCode ?? "",
        orderQuantity: 1,
        inputPrice: product.unitPriceInTable,
        priceTableId: priceTable.id,
        itemDiscountPercentage: order.customer?.discountPercent ?? 0,
      },
    })
      .then((taxesResponse) => {
        console.log("[taxes] resposta recebida", taxesResponse);
        // Compara normalizado (trim + lower) — Datasul/Progress costuma
        // devolver códigos com padding ou caixa diferente.
        const normalize = (s?: string) => (s ?? "").trim().toLowerCase();
        const target = normalize(product.id);
        const taxItem = taxesResponse?.itens?.find(
          (t) => normalize(t.produto.codigo_produto) === target,
        );
        if (!taxItem) {
          console.warn(
            "[taxes] nenhum item encontrado na resposta para",
            product.id,
            "— itens recebidos:",
            taxesResponse?.itens?.map((t) => t.produto.codigo_produto),
          );
          return;
        }

        const p = taxItem.produto;
        const orderId = order.id ?? "";
        const base = (
          taxName: string,
          taxBase: number,
          taxPercentual: number,
          taxValue: number,
        ) => ({
          id: uuid.v4(),
          itemId: newOrderItem.id,
          orderId,
          taxBase,
          taxBaseReduction: 0,
          taxName,
          taxPercentual,
          taxValue,
          mva: 0,
        });
        const itemTaxes: OrderItemModel["taxes"] = [
          base(
            "COFINS",
            p.base_calculo_cofins,
            p.aliquota_cofins,
            p.valor_cofins,
          ),
          base("PIS", p.base_calculo_pis, p.aliquota_pis, p.valor_pis),
          base("IPI", p.base_calculo_ipi, p.aliquota_ipi, p.valor_ipi),
          base("CSLL", 0, p.aliquota_csll, p.valor_csll),
          base("ICMS", p.base_calculo_icms, p.aliquota_icms, p.valor_icms),
          base("ICMS-ST", p.base_calculo_st, p.aliquota_st, p.valor_st),
          ...(p.reforma ?? []).map((r): OrderItemModel["taxes"][number] => ({
            id: uuid.v4(),
            itemId: finalItemId,
            orderId,
            taxBase: r.base_tributo,
            taxBaseReduction: r.perc_reducao_governamental,
            taxName: r.tipo_tributo_descricao,
            taxPercentual: r.aliquota,
            taxValue: r.valor_tributo,
            mva: 0,
          })),
        ];

        console.log("[taxes] aplicando ao item", finalItemId, itemTaxes);
        // Usa setOrder funcional para evitar stale closure logo após o addItem.
        // O setOrder exposto pelo contexto está tipado como `(order) => void`,
        // mas internamente é o setter do useState, que aceita updater funcional.
        // O cast abaixo é seguro em runtime.
        const setOrderFn = setOrder as unknown as Dispatch<
          SetStateAction<OrderModel>
        >;
        setOrderFn((prev) => ({
          ...prev,
          items: prev.items.map((it) =>
            it.id === finalItemId
              ? { ...it, taxes: itemTaxes, isLoadingTaxes: false }
              : it,
          ),
        }));
      })
      .catch((err) => {
        console.error("[taxes] falha no cálculo", err);
        // Limpa o estado de loading mesmo em caso de erro — caso contrário o
        // skeleton ficaria preso na tela.
        const setOrderFn = setOrder as unknown as Dispatch<
          SetStateAction<OrderModel>
        >;
        setOrderFn((prev) => ({
          ...prev,
          items: prev.items.map((it) =>
            it.id === finalItemId ? { ...it, isLoadingTaxes: false } : it,
          ),
        }));
      });
    toast.success(
      `Produto adicionado ${order.isBudget ? "à simulação" : "ao pedido"}`,
      {
        duration: 1000,
      },
    );

    // Devolve o foco para o combo de produtos para o usuário continuar
    // adicionando sem precisar usar o mouse. setTimeout 0 garante que rode
    // após o ciclo atual de renderização e os fechamentos de dialog.
    setTimeout(() => {
      productsComboRef.current?.focus();
    }, 0);
  }

  // Total c/desconto — fonte única em order-utils (regra I24).
  const grandTotalWithDiscount = calcOrderItemsTotalWithDiscount(order);
  const anyItemLoadingTaxes = order.items.some((i) => i.isLoadingTaxes);

  const sortedItems = order.items.sort((a, b) => a.sequence - b.sequence);
  //console.log("ITEMS PRE EXISTENTES", order);
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
                {/* Combo de seleção rápida de produto: oculto em telas
                    estreitas (< lg / 1024px). Nesses casos o usuário adiciona
                    produtos pelo modal de pesquisa (OrderSearchProductModal). */}
                <div className="hidden lg:block flex-1 form-group">
                  <Label>Pesquisar Produto para Adicionar</Label>
                  <ProductsCombo
                    ref={productsComboRef}
                    onSelect={handleAddItem}
                    priceTableId={order.customer?.priceTables[0].id ?? ""}
                    customerId={order.customerId}
                    branchId={order.branchId || order.customer?.branchId || ""}
                    closeOnSelect
                  />
                </div>
                <OrderSearchProductModal initialPriceTable={priceTable} />
                <div className="hidden md:flex items-center gap-x-1">
                  <AppTooltip
                    message="Ver em Tabela"
                    className="bg-emerald-700"
                    indicatorClassName="!bg-emerald-700 fill-emerald-700"
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowCard(false)}
                      className={cn(
                        "flex items-center justify-center p-1 bg-neutral-50 rounded-md size-9 border-neutral-200 border cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors",
                        !showCard && "bg-emerald-500 border-0 text-white",
                      )}
                    >
                      <Table2Icon className="size-4" />
                    </button>
                  </AppTooltip>
                  <AppTooltip
                    message="Ver em Cards"
                    className="bg-emerald-700"
                    indicatorClassName="!bg-emerald-700 fill-emerald-700"
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowCard(true)}
                      className={cn(
                        "flex items-center justify-center p-1 bg-neutral-50 rounded-md size-9 border-neutral-200 border cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors",
                        showCard && "bg-emerald-500 border-0 text-white",
                      )}
                    >
                      <StretchHorizontalIcon className="size-4" />
                    </button>
                  </AppTooltip>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      {!useCardView && <OrderItemTable />}
      {useCardView && (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-[70%_30%] border-y w-full",
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
              <div className="flex items-center gap-2 text-lg font-semibold">
                Total {order.isBudget ? "da Simulação" : "do Pedido"}:{" "}
                {anyItemLoadingTaxes ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  <span>R$ {formatNumber(grandTotalWithDiscount, 2)}</span>
                )}
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
                {formatNumber(
                  order.items.reduce(
                    (acc, it) =>
                      acc +
                      it.inputPrice *
                        it.orderQuantity *
                        (1 - getItemDiscountFactor(it, order)),
                    0,
                  ),
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
