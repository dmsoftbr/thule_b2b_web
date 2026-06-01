import { api, handleError } from "@/lib/api";
import { roundNumber } from "@/lib/number-utils";
import type { UserPermissionModel } from "@/models/admin/user-permission.model";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import type { OrderModel } from "@/models/orders/order-model";
import type { OutletCartItem } from "@/models/outlet/outlet-cart-item.model";
import type { CustomerModel } from "@/models/registrations/customer.model";
import type { ProductModel } from "@/models/product.model";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import type { TaxResponseDto } from "@/models/dto/responses/tax-response.model";
import { ProductsService } from "@/services/registrations/products.service";
import { RepresentativesService } from "@/services/registrations/representatives.service";
import * as uuid from "uuid";
import type { Dispatch, SetStateAction } from "react";

import { toast } from "sonner";

export type OutletOrderData = {
  customerId: number;
  customer: CustomerModel;
  paymentConditionId: number;
  deliveryLocationId: string;
  branchId: string;
  items: OutletCartItem[];
};

export const NEW_ORDER_EMPTY: OrderModel = {
  id: "",
  customerId: 0,
  createdAt: new Date(),
  representativeId: 0,
  carrierId: 0,
  orderClassificationId: 1,
  deliveryLocationId: "",
  discountPercentual: 0,
  integrationMessage: "",
  paymentConditionId: 0,
  grossTotalValue: 0,
  netTotalValue: 0,
  statusId: 0,
  whatAppPhoneNumber: "",
  branchId: "",
  items: [],
  isBudget: false,
  fiscalOperationId: "",
  isCompleted: false,
  isParcialBilling: true,
  comments: "",
  additionalDiscount: 0,
  createdBy: "",
  creditStatusId: 1,
  currencyId: 0,
  customerAbbreviation: "",
  erpOrderId: 0,
  freightPayedValue: 0,
  freightPaymentId: 1,
  freightTypeId: 1,
  freightValue: 0,
  orderId: "",
  orderRepId: "",
  origin: "",
  priceTypeId: 1,
  useCustomerCarrier: false,
};

export const getOrderClassification = (id: number) => {
  if (id < 3) return "Venda";
  if (id == 3) return "Bonificação";
  if (id == 4) return "Consignação";
  if (id == 5) return "Garantia";
  if (id == 6) return "Outlet";
};

export const getOrderClassificationCss = (id: number) => {
  if (id < 3) return "bg-emerald-600";
  if (id == 3) return "bg-purple-600";
  if (id == 4) return "Consignação";
  if (id == 5) return "bg-orange-400";
  if (id == 6) return "bg-blue-400";
};

export const NEW_ORDER_ITEM_EMPTY: Omit<
  OrderItemModel,
  "priceTable" | "product" | "taxes"
> = {
  orderId: "",
  sequence: 0,
  productId: "",
  orderQuantity: 0,
  availability: "",
  deliveryDate: new Date(),
  inputPrice: 0,
  priceTablePrice: 0,
  suggestPrice: 0,
  priceTableId: "",
  grossItemValue: 0,
  allocatedQuantity: 0,
  comments: "",
  customerAbbreviation: "",
  deliveredQuantity: 0,
  fiscalOperationId: "",
  id: "",
  ncm: "",
  netItemValue: 0,
  originalDeliveryDate: new Date(),
  referenceCode: "",
  statusId: 1,
  costValue: 0,
};

export const NEW_BUDGET_EMPTY: OrderModel = {
  id: "",
  customerId: 0,
  createdAt: new Date(),
  representativeId: 0,
  carrierId: 0,
  deliveryLocationId: "",
  discountPercentual: 0,
  integrationMessage: "",
  paymentConditionId: 0,
  grossTotalValue: 0,
  netTotalValue: 0,
  orderClassificationId: 1,
  statusId: 0,
  whatAppPhoneNumber: "",
  branchId: "",
  items: [],
  isBudget: true,
  fiscalOperationId: "",
  isCompleted: false,
  comments: "",
  additionalDiscount: 0,
  currencyId: 0,
  createdBy: "",
  creditStatusId: 1,
  customerAbbreviation: "",
  erpOrderId: 0,
  freightPayedValue: 0,
  freightPaymentId: 0,
  freightTypeId: 1,
  freightValue: 0,
  isParcialBilling: true,
  orderId: "",
  orderRepId: "",
  origin: "",
  priceTypeId: 1,
  useCustomerCarrier: false,
};

export const generateOrderFromOutlet = async (
  data: OutletOrderData,
): Promise<OrderModel> => {
  const newOrder = { ...NEW_ORDER_EMPTY, items: [] as OrderItemModel[] };

  newOrder.customerId = Number(data.customerId);
  newOrder.representativeId = data.customer.representativeId;
  newOrder.branchId = data.customer.branchId;
  newOrder.currencyId = 0;
  newOrder.statusId = 1;
  newOrder.discountPercentual = 0;
  newOrder.orderClassificationId = 6; // outlet

  const repData = await new RepresentativesService().getById(
    newOrder.representativeId,
  );
  newOrder.representative = repData;

  //const customerData = await CustomersService.getById(newOrder.customerId);
  newOrder.customer = data.customer;
  newOrder.carrierId = data.customer.carrierId;
  newOrder.customerAbbreviation = data.customer.abbreviation;
  newOrder.deliveryLocationId =
    data.customer.deliveryLocations?.length > 0
      ? data.customer.deliveryLocations[0].id
      : "";
  for (const [index, item] of (data.items ?? []).entries()) {
    const orderItem: OrderItemModel = {
      ...NEW_ORDER_ITEM_EMPTY,
      product: item.product!,
      taxes: [],
      priceTable: item.priceTable!,
    };
    orderItem.availability = "C";
    orderItem.orderQuantity = item.quantity;
    orderItem.productId = item.id;
    orderItem.priceTableId = item.priceTableId;
    orderItem.sequence = (index + 1) * 10;
    orderItem.inputPrice = item.price;
    orderItem.suggestPrice = item.price;
    const productData = await ProductsService.getById(item.id);
    orderItem.product = productData;

    newOrder.items.push(orderItem);
  }

  return newOrder;
};

export const getUserPermissions = async (userId: string) => {
  try {
    const { data } = await api.get<UserPermissionModel[]>(
      `/admin/users/permissions/${encodeURIComponent(userId)}`,
    );

    return data;
  } catch (error) {
    toast.error(handleError(error));
  }
};

// Calcula os impostos do pedido chamando o endpoint /order-items/calc-item-taxes.
// Função pura — recebe o order e um AbortSignal opcional, devolve o DTO de impostos
// (ou undefined se não houver itens / resposta vazia). Quem chamar é responsável
// por gerenciar loading state, AbortController e tratamento de erro.
export const calcOrderTaxes = async (
  order: OrderModel,
  signal?: AbortSignal,
): Promise<TaxResponseDto | undefined> => {
  if (order.items.length == 0) return undefined;

  const payload = {
    BranchId: order.branchId,
    SalesType: "N",
    CustomerId: String(order.customerId),
    CustomerUnit: "",
    CustomerIdDelivery: String(order.customerId),
    CustomerUnitDelivery: "",
    Currency: 0,
    Payment: String(order.paymentConditionId),
    Freight: order.freightValue,
    ListofProducts: order.items.map((item) => ({
      ItemId: `${item.sequence + 10}`,
      ProductId: item.productId,
      CodRefer: item.referenceCode,
      Quantity: item.orderQuantity,
      UnitaryValue: item.inputPrice * getItemDiscountFactor(item, order),
      TotalValue: item.inputPrice * item.orderQuantity,
      TES: order.customer?.fiscalOperationId ?? "",
      ItemDiscountPercentage: 0,
      PriceTableId: item.priceTableId,
    })),
  };

  const { data } = await api.post<TaxResponseDto>(
    `/order-items/calc-item-taxes`,
    payload,
    { signal },
  );

  console.log("[calcOrderTaxes] resposta da API de impostos:", data);
  return data;
};

// Variante de calcOrderTaxes que recebe as propriedades do pedido uma a uma
// e um único produto. Útil em contextos onde ainda não temos um OrderModel
// montado (ex.: catálogo / outlet / pré-cálculo de item avulso).
export type CalcSingleProductTaxesParams = {
  branchId: string;
  customerId: number | string;
  paymentConditionId: number | string;
  freightValue: number;
  discountPercentual: number;
  fiscalOperationId: string;
  product: {
    sequence: number;
    productId: string;
    referenceCode: string;
    orderQuantity: number;
    inputPrice: number;
    priceTableId: string;
    itemDiscountPercentage?: number;
  };
};

export const calcSingleProductTaxes = async (
  params: CalcSingleProductTaxesParams,
  signal?: AbortSignal,
): Promise<TaxResponseDto | undefined> => {
  const {
    branchId,
    customerId,
    paymentConditionId,
    freightValue,
    fiscalOperationId,
    product,
  } = params;

  const payload = {
    BranchId: branchId,
    SalesType: "N",
    CustomerId: String(customerId),
    CustomerUnit: "",
    CustomerIdDelivery: String(customerId),
    CustomerUnitDelivery: "",
    Currency: 0,
    Payment: String(paymentConditionId),
    Freight: freightValue,
    ListofProducts: [
      {
        ItemId: `${product.sequence + 10}`,
        ProductId: product.productId,
        CodRefer: product.referenceCode,
        Quantity: product.orderQuantity,
        UnitaryValue:
          product.inputPrice,
        TotalValue: product.inputPrice * product.orderQuantity,
        TES: fiscalOperationId,
        ItemDiscountPercentage: product.itemDiscountPercentage ?? 0,
        PriceTableId: product.priceTableId,
      },
    ],
  };

  const { data } = await api.post<TaxResponseDto>(
    `/order-items/calc-item-taxes`,
    payload,
    { signal },
  );

  console.log("[calcSingleProductTaxes] resposta da API de impostos:", data);
  return data;
};

/* --------------------------------------------------------------------------
 * Adiciona um produto ao pedido — FONTE ÚNICA da inclusão de item.
 * Calcula data de entrega, CFOP e dispara o cálculo de impostos em segundo
 * plano (marcando isLoadingTaxes). Usado tanto pelo combo de produtos
 * (order-form-items) quanto pelo modal de pesquisa (order-search-product-modal),
 * para que ambos os caminhos tragam os impostos de cada item.
 * Recebe o setOrder funcional (do useState) para evitar stale closure.
 * ------------------------------------------------------------------------ */
export async function addProductToOrder(params: {
  product: ProductModel;
  quantity: number;
  priceTable: PriceTableModel;
  order: OrderModel;
  setOrder: Dispatch<SetStateAction<OrderModel>>;
}): Promise<void> {
  const { product, quantity, priceTable, order, setOrder } = params;
  const orderQuantity = quantity < 1 ? 1 : quantity;

  // Respeita o estabelecimento escolhido no cabeçalho; só faz fallback para o
  // branch do cliente (ou "1") quando o pedido ainda está sem estabelecimento.
  const effectiveBranchId = order.branchId || order.customer?.branchId || "1";
  if (order.branchId !== effectiveBranchId) {
    setOrder((prev) => ({ ...prev, branchId: effectiveBranchId }));
  }

  // Data de entrega.
  const { data: deliveryData } = await api.post(`/stock/caculate-delivery-date`, {
    orderId: order.id,
    customerAbbreviation: order.customerAbbreviation,
    productId: product.id,
    quantity: orderQuantity,
  });

  // Matriz de CFOP -> fiscalOperationId do item.
  // ATENÇÃO: o endpoint responde text/plain com o CFOP cru (sem aspas). Quando
  // o CFOP é só dígitos (ex.: "510201" — 64 dos 261 da MatrizCfop), o axios
  // roda JSON.parse e o transforma em NÚMERO. Como fiscalOperationId é string
  // (e o backend rejeita número na gravação), coagimos para string abaixo.
  const fiscalOperationForOrder = order.customer?.fiscalOperationId;
  const { data: cfopData } = await api.post(`/order-items/matriz-cfop-item`, {
    branchId: effectiveBranchId,
    customerAbbreviation: order.customer?.abbreviation,
    productId: product.id,
    fiscalOperationId: fiscalOperationForOrder,
  });
  const fiscalOperationId = String(cfopData ?? "");

  const newItemId = uuid.v4();
  const newSequence = order.items.length + 10;

  const newOrderItem: OrderItemModel = {
    ...NEW_ORDER_ITEM_EMPTY,
    ...product,
    id: newItemId,
    productId: product.id,
    product,
    deliveryDate: deliveryData.estimatedDate,
    availability: deliveryData.availbility,
    inputPrice: product.unitPriceInTable,
    suggestPrice: product.suggestUnitPrice,
    priceTablePrice: product.unitPriceInTable,
    exceptionMarginPercent: product.exceptionMarginPercent ?? null,
    exceptionTableId: product.exceptionTableId ?? null,
    grossItemValue: product.unitPriceInTable * orderQuantity,
    orderQuantity,
    sequence: newSequence,
    taxes: [],
    isLoadingTaxes: true,
    priceTable,
    priceTableId: priceTable.id,
    costValue: 0,
    fiscalOperationId,
  };

  // Adiciona o item (append imutável — sem stale closure).
  setOrder((prev) => ({ ...prev, items: [...prev.items, newOrderItem] }));

  // Recupera os impostos em segundo plano. Na adição o pedido ainda pode não
  // ter condição de pagamento; usa a condição padrão do cliente.
  const paymentConditionForTaxes =
    order.customer?.paymentConditionId ?? order.paymentConditionId;

  try {
    const taxesResponse = await calcSingleProductTaxes({
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
        orderQuantity,
        inputPrice: product.unitPriceInTable,
        priceTableId: priceTable.id,
        itemDiscountPercentage: order.customer?.discountPercent ?? 0,
      },
    });

    // Compara normalizado (trim + lower) — Datasul/Progress costuma devolver
    // códigos com padding ou caixa diferente.
    const normalize = (s?: string) => (s ?? "").trim().toLowerCase();
    const target = normalize(product.id);
    const taxItem = taxesResponse?.itens?.find(
      (t) => normalize(t.produto.codigo_produto) === target,
    );
    if (!taxItem) {
      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === newItemId ? { ...it, isLoadingTaxes: false } : it,
        ),
      }));
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
      itemId: newItemId,
      orderId,
      taxBase,
      taxBaseReduction: 0,
      taxName,
      taxPercentual,
      taxValue,
      mva: 0,
    });
    const itemTaxes: OrderItemModel["taxes"] = [
      base("COFINS", p.base_calculo_cofins, p.aliquota_cofins, p.valor_cofins),
      base("PIS", p.base_calculo_pis, p.aliquota_pis, p.valor_pis),
      base("IPI", p.base_calculo_ipi, p.aliquota_ipi, p.valor_ipi),
      base("CSLL", 0, p.aliquota_csll, p.valor_csll),
      base("ICMS", p.base_calculo_icms, p.aliquota_icms, p.valor_icms),
      base("ICMS-ST", p.base_calculo_st, p.aliquota_st, p.valor_st),
      ...(p.reforma ?? []).map((r): OrderItemModel["taxes"][number] => ({
        id: uuid.v4(),
        itemId: newItemId,
        orderId,
        taxBase: r.base_tributo,
        taxBaseReduction: r.perc_reducao_governamental,
        taxName: r.tipo_tributo_descricao,
        taxPercentual: r.aliquota,
        taxValue: r.valor_tributo,
        mva: 0,
      })),
    ];

    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === newItemId
          ? { ...it, taxes: itemTaxes, isLoadingTaxes: false }
          : it,
      ),
    }));
  } catch (err) {
    console.error("[taxes] falha no cálculo", err);
    // Limpa o loading mesmo em erro — senão o skeleton fica preso na tela.
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === newItemId ? { ...it, isLoadingTaxes: false } : it,
      ),
    }));
  }
}

/* ==========================================================================
 * Motor de cálculo de preço do item — FONTE ÚNICA DA VERDADE
 * --------------------------------------------------------------------------
 * Toda a UI (tabela, footer, card e finalização) deve calcular preço/total/
 * margem/markup por estas funções, em vez de reimplementar a fórmula em cada
 * tela. Assim o mesmo item nunca exibe valores diferentes em telas diferentes.
 *
 * Regra do preço final, conforme a planilha "Simulação Preço" (linha 24 —
 * "SEM ST e SEM IPI"):
 *   PreçoFinal = InputPrice × (1 − %DescCliente/100) − ValorIPI
 * O desconto do cliente incide sobre o preço base; o IPI (já embutido no preço
 * base) é subtraído como valor absoluto. Durante a edição, item.taxes[].taxValue
 * está em valor CRU (sem desconto) — por isso o IPI é subtraído cru.
 * ========================================================================== */

// Prefixos de tributos da reforma (CBS/IBS e variantes "IBS Mun"/"IBS UF")
// ocultados nas somas exibidas ao usuário — permanecem no state p/ envio.
export const HIDDEN_TAX_PREFIXES = ["CBS", "IBS"];

export const findItemTax = (item: OrderItemModel, name: string) =>
  item.taxes?.find(
    (t) => (t.taxName ?? "").trim().toUpperCase() === name.toUpperCase(),
  );

// Fator de desconto do cliente (ex.: 0,82 para 18%). Prioriza o desconto do
// pedido e cai para o cadastro do cliente.
export const getCustomerDiscountFactor = (order: OrderModel) => {
  const discount =
    order.discountPercentual ?? order.customer?.discountPercent ?? 0;
  return 1 - discount / 100;
};

// Fator de desconto aplicável a UM item. Itens de grupo de desconto já têm o
// preço final (margem) embutido no inputPrice, então o desconto padrão do
// cliente NÃO incide sobre eles (fator 1). Os demais usam o desconto do pedido.
export const getItemDiscountFactor = (item: OrderItemModel, order: OrderModel) =>
  item.exceptionMarginPercent != null ? 1 : getCustomerDiscountFactor(order);

// O IPI só é descontado do preço final quando o estabelecimento é "1"
// (importadora). Para os demais estabelecimentos o IPI NÃO é subtraído.
export const shouldSubtractIpi = (order: OrderModel) => order.branchId === "1";

// Preço unitário final líquido do item (I24). O IPI só é subtraído quando o
// estabelecimento é "1" (ver shouldSubtractIpi).
// Item de grupo de desconto: o inputPrice (preço por margem) JÁ é o preço final
// — não incide desconto do cliente NEM subtração de IPI. Assim "Preço Compra
// Unit" e "Total Compra c/ Desconto" ficam iguais em qualquer estabelecimento.
export const calcUnitPriceWithDiscount = (
  item: OrderItemModel,
  order: OrderModel,
) => {
  const isDiscountGroup = item.exceptionMarginPercent != null;
  const ipiValor =
    !isDiscountGroup && shouldSubtractIpi(order)
      ? (findItemTax(item, "IPI")?.taxValue ?? 0)
      : 0;
  return item.inputPrice * getItemDiscountFactor(item, order) - ipiValor;
};

// Total do item: preço unitário final × quantidade.
export const calcItemTotalWithDiscount = (
  item: OrderItemModel,
  order: OrderModel,
) => calcUnitPriceWithDiscount(item, order) * item.orderQuantity;

// "Preço de Compra C/ST e IPI" (coluna G da planilha "Simulação Preço", linha 48):
//   G = PreçoDeCompra(D) + ICMS-ST + IPI
// onde D = calcUnitPriceWithDiscount. ST/IPI são os valores CRUS dos tributos
// do item. Não é exibido como coluna — serve de base para Markup e Margem.
export const calcItemPriceWithStAndIpi = (
  item: OrderItemModel,
  order: OrderModel,
) => {
  const st = findItemTax(item, "ICMS-ST")?.taxValue ?? 0;
  const ipi = findItemTax(item, "IPI")?.taxValue ?? 0;
  return calcUnitPriceWithDiscount(item, order) + st + ipi;
};

// Markup = Preço de Venda Sugerido / Preço de Compra C/ST e IPI (G, linha 48).
export const calcItemMarkup = (item: OrderItemModel, order: OrderModel) => {
  const g = calcItemPriceWithStAndIpi(item, order);
  return g === 0 ? 0 : item.suggestPrice / g;
};

// Margem (%) = (1 − Preço de Compra C/ST e IPI / Preço de Venda Sugerido) × 100
// (linha 48: "NOVO DESCONTO" = G / PreçoSug).
export const calcItemMarginPercent = (
  item: OrderItemModel,
  order: OrderModel,
) => {
  const suggest = item.suggestPrice === 0 ? 1 : item.suggestPrice;
  return (1 - calcItemPriceWithStAndIpi(item, order) / suggest) * 100;
};

// Tributos visíveis do item (exclui CBS/IBS da reforma).
export const getVisibleItemTaxes = (item: OrderItemModel) =>
  (item.taxes ?? []).filter((t) => {
    const name = (t.taxName ?? "").trim().toUpperCase();
    return !HIDDEN_TAX_PREFIXES.some(
      (p) => name === p || name.startsWith(`${p} `),
    );
  });

// Total de tributos visíveis do item (× quantidade × fator de desconto), como
// exibido na coluna "Impostos" da tabela.
export const calcItemVisibleTaxesTotal = (
  item: OrderItemModel,
  order: OrderModel,
) =>
  getVisibleItemTaxes(item).reduce((acc, t) => acc + (t.taxValue ?? 0), 0) *
  item.orderQuantity *
  getItemDiscountFactor(item, order);

// Monta o detalhamento de impostos (TaxesDetail) a partir dos tributos já
// gravados em order.items[].taxes — usado em modo VISUALIZAÇÃO, onde a API de
// cálculo (calcOrderTaxes) não é chamada e portanto taxesData fica indefinido.
// Agrega por tipo de imposto somando valor e base com a MESMA fórmula da linha
// "Impostos" do pedido (× quantidade × fator de desconto), garantindo que o
// detalhe some exatamente o total exibido. Tributos da reforma (CBS/IBS) são
// excluídos por getVisibleItemTaxes, coerente com o filtro da própria modal.
export const buildTaxesDetailFromOrderItems = (
  order: OrderModel,
): TaxResponseDto => {
  const grouped = new Map<
    string,
    { descricao: string; valor: number; base_calculo: number; aliquota: number }
  >();

  order.items.forEach((item) => {
    const factor = getItemDiscountFactor(item, order);
    getVisibleItemTaxes(item).forEach((tax) => {
      const descricao = (tax.taxName ?? "").trim();
      const key = descricao.toUpperCase();
      const valor = (tax.taxValue ?? 0) * item.orderQuantity * factor;
      const base = (tax.taxBase ?? 0) * item.orderQuantity * factor;

      const existing = grouped.get(key);
      if (existing) {
        existing.valor += valor;
        existing.base_calculo += base;
      } else {
        grouped.set(key, {
          descricao,
          valor,
          base_calculo: base,
          aliquota: tax.taxPercentual ?? 0,
        });
      }
    });
  });

  const TaxesDetail = Array.from(grouped.values()).map((g) => ({
    imposto: g.descricao,
    descricao: g.descricao,
    base_calculo: g.base_calculo,
    aliquota: g.aliquota,
    valor: g.valor,
  }));

  return {
    seguro: 0,
    desconto: 0,
    frete: order.freightValue ?? 0,
    despesas_acessorias: 0,
    valor_contabil: 0,
    valor_mercadoria: 0,
    base_duplicada: 0,
    total_impostos: TaxesDetail.reduce((acc, t) => acc + t.valor, 0),
    total_impostos_sem_incidencia: 0,
    total_impostos_embutidos: 0,
    itens: [],
    TaxesDetail,
  };
};

// Soma do "Total c/Desconto" de todos os itens do pedido (footer / cards).
export const calcOrderItemsTotalWithDiscount = (order: OrderModel) =>
  order.items.reduce(
    (acc, item) => acc + calcItemTotalWithDiscount(item, order),
    0,
  );

// Sub-total bruto do pedido (Σ InputPrice × Qtde), sem desconto/impostos.
export const calcOrderGrossSubtotal = (order: OrderModel) =>
  order.items.reduce((acc, item) => acc + item.inputPrice * item.orderQuantity, 0);

// Congela o snapshot de preço calculado nos campos persistidos do item, para
// que o pedido gravado carregue o valor exibido ao usuário (sem recálculo
// posterior). Os tributos continuam sendo gravados em item.taxes (tabela
// OrderItemTaxes), não aqui. Deve ser chamada ANTES de reescrever item.taxes,
// pois lê o IPI cru exibido em tela.
export const withPricingSnapshot = (
  item: OrderItemModel,
  order: OrderModel,
): OrderItemModel => ({
  ...item,
  grossItemValue: item.inputPrice * item.orderQuantity,
  netItemValue: calcItemTotalWithDiscount(item, order),
});

/* --------------------------------------------------------------------------
 * Total do pedido COM impostos (valor de fatura exibido na finalização).
 * ATENÇÃO: é uma grandeza DIFERENTE do "preço final líquido" (I24) exibido por
 * item — aqui os tributos são SOMADOS de volta. A composição (base desembutida
 * de IPI + reconciliação p/ não duplicar IPI/ICMS-ST já embutidos) é mantida
 * idêntica à que estava no finish-order-modal; apenas foi centralizada aqui.
 * -------------------------------------------------------------------------- */
export const calcOrderTotalWithTaxes = (
  order: OrderModel,
  // Mantido por compatibilidade de assinatura. NÃO é somado ao total: ICMS, PIS
  // e COFINS são "por dentro" (já embutidos no preço) e CSLL não é tributo de
  // nota — somá-los seria imposto sobre imposto. Só IPI e ICMS-ST ("por fora")
  // entram, e já estão em itemsTotal.
  _totalTaxes: number,
): number => {
  let itemsTotal = order.items.reduce((acc, item) => {
    const discountFactor = getItemDiscountFactor(item, order);
    const ipi = findItemTax(item, "IPI");
    const icmsSt = findItemTax(item, "ICMS-ST");
    const ipiAliquota = ipi?.taxPercentual ?? 0;
    const ipiValor = ipi?.taxValue ?? 0;
    const icmsStValor = icmsSt?.taxValue ?? 0;
    const desembutidoIpi = item.inputPrice / (1 + ipiAliquota / 100);
    const desembutidoComDesconto = desembutidoIpi * discountFactor;
    // IPI e ICMS-ST ("por fora") escalam com a base com desconto.
    const unit =
      desembutidoComDesconto +
      ipiValor * discountFactor +
      icmsStValor * discountFactor;
    return acc + unit * item.orderQuantity;
  }, 0);

  if (order.additionalDiscount > 0) {
    itemsTotal = roundNumber(
      itemsTotal - (itemsTotal * (order.additionalDiscount ?? 0)) / 100,
      2,
    );
  }

  // Total da nota = produtos (c/ desconto, com IPI e ICMS-ST embutidos) + frete.
  // ICMS/PIS/COFINS já estão no preço — não são somados de novo.
  return roundNumber(itemsTotal + (order.freightValue ?? 0), 2);
};

export const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "C":
      return "bg-emerald-500 text-white";
    case "B":
      return "bg-red-300 text-white";
    case "B2":
      return "bg-red-500 text-white";
    case "B3":
      return "bg-pink-500 text-white";
    case "B4":
      return "bg-purple-500 text-white";
    case "P":
      return "bg-blue-300 text-white";
    default:
      return "bg-neutral-200 text-white";
  }
};
