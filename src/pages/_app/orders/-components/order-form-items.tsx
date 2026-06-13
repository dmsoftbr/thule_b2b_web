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
  addProductToOrder,
  calcOrderItemsTotalWithDiscount,
  getItemDiscountFactor,
} from "../-utils/order-utils";
import { api } from "@/lib/api";
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
  const { order, mode, setOrder } = useOrder();
  // Default de visualização por largura: a tabela de itens (min-w ~1024) só cabe
  // folgada, junto da sidebar, a partir de ~1280px. Abaixo disso (tablets em
  // retrato/paisagem e mobile) a leitura em Card é muito melhor que rolar uma
  // tabela de 11 colunas — então vira o DEFAULT. O usuário ainda pode alternar
  // pelo toggle; matchMedia reage a resize/rotação e, ao cruzar o breakpoint,
  // reverte ao default daquela faixa.
  const fitsTableQuery = "(min-width: 1280px)";
  const [showCard, setShowCard] = useState(
    typeof window === "undefined" ||
      !window.matchMedia(fitsTableQuery).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(fitsTableQuery);
    const handler = (e: MediaQueryListEvent) => setShowCard(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const useCardView = showCard;
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

  // Cliente sem grupo de venda: os dados aparecem no cabeçalho (desabilitados),
  // mas a inclusão de produtos fica bloqueada — não é possível incluir o pedido.
  // Só vale ao EDITAR/INCLUIR: em VIEW o pedido já existe (logo já tinha grupo) e
  // o customer carregado pode vir sem salesGroup hidratado — não bloquear a visão.
  const hasSalesGroup =
    !!order.customer?.salesGroup && order.customer.salesGroup.length > 0;
  if (isEditing && !hasSalesGroup) {
    return (
      <div className="w-full p-2 flex flex-col items-center min-h-[100px]">
        <div className="my-4 text-center text-neutral-600">
          Cliente sem grupo de venda associado — não é possível incluir{" "}
          {order.isBudget ? "a simulação" : "o pedido"}.
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

    // Inclusão do item (data de entrega + CFOP + cálculo de impostos em
    // segundo plano) — fonte única em order-utils, compartilhada com o modal
    // de pesquisa de produtos.
    await addProductToOrder({
      product,
      quantity: 1,
      priceTable,
      order,
      setOrder: setOrder as unknown as Dispatch<SetStateAction<OrderModel>>,
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
    <div className="w-full p-2 container flex flex-col items-center flex-1 min-h-0 overflow-hidden">
      <div className="flex gap-x-4 mb-2 container w-full">
        <div className="flex flex-1 items-center justify-center">
          {/* Em telas grandes (>= xl) Tabela de Preço e a pesquisa de produto
              ficam na MESMA linha (como era originalmente). Em tablets (retrato/
              paisagem) e smartphones empilham em 2 linhas. */}
          <div className="flex flex-col xl:flex-row xl:items-end gap-2 w-full">
            {order.orderClassificationId < 6 && isEditing ? (
              <>
                {/* Tabela de Preço */}
                <div className="form-group w-full xl:w-auto">
                  <Label className="whitespace-nowrap">Tabela de Preço</Label>
                  <SearchCombo
                    className="h-9.5 w-full sm:min-w-[200px]"
                    defaultValue={order.customer?.priceTables[0].id}
                    staticItems={convertArrayToSearchComboItem(
                      order.customer?.priceTables ?? [],
                      "id",
                      // Algumas tabelas (ex.: PrBase) têm portalName vazio — cai no
                      // nome cadastral para o combo não ficar em branco.
                      (pt) => pt.portalName || pt.name,
                    )}
                    onSelectOption={(opt) => setPriceTable(opt[0].extra)}
                  />
                </div>
                {/* Pesquisa de produto + ações (ocupa o resto da linha em >= xl) */}
                <div className="flex flex-wrap gap-2 w-full xl:flex-1 items-end">
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
            // Em telas estreitas (tablet retrato/mobile) os cards ocupam a largura
            // toda e o resumo vai abaixo; o painel lateral 70/30 só a partir de lg.
            "grid grid-cols-1 lg:grid-cols-[70%_30%] border-y w-full flex-1 min-h-0",
            !order.items && "grid-cols-1 border-0",
          )}
        >
          <ScrollArea className="h-full min-h-0" type="always">
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
            <div className="border-t lg:border-t-0 lg:border-x flex items-center justify-center flex-col gap-1 py-3">
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
