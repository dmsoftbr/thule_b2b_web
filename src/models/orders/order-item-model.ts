import type { ProductModel } from "../product.model";
import type { PriceTableModel } from "../registrations/price-table.model";
import type { OrderItemTaxModel } from "./order-item-tax-model";

export type OrderItemModel = {
  id: string;
  orderId: string;
  productId: string;
  orderQuantity: number;
  inputPrice: number;
  priceTablePrice: number;
  priceTableId: string;
  deliveryDate: Date;
  originalDeliveryDate: Date;
  availability: string;
  referenceCode: string;
  ncm: string;
  sequence: number;
  deliveredQuantity: number;
  allocatedQuantity: number;
  statusId: number;
  comments: string;
  customerAbbreviation: string;
  fiscalOperationId: string;
  grossItemValue: number;
  netItemValue: number;
  suggestPrice: number;
  costValue: number;
  // Margem (%) quando o item veio de um grupo de desconto. Quando preenchido,
  // o inputPrice já é o preço final e o desconto padrão do cliente NÃO incide.
  exceptionMarginPercent?: number | null;
  // Grupo de desconto (tabela de exceção) ao qual o item pertence. O pedido fica
  // "preso" a este grupo: não pode misturar produtos de grupos diferentes.
  exceptionTableId?: string | null;
  product: ProductModel;
  taxes: OrderItemTaxModel[];
  priceTable: PriceTableModel;
  // Flag transitória usada apenas na UI para exibir skeleton enquanto a
  // API de impostos é chamada. Não é persistida no backend.
  isLoadingTaxes?: boolean;
  // Flag transitória: o cálculo de impostos deste item falhou (erro na API do
  // Datasul ou item ausente na resposta). Bloqueia a gravação do pedido/
  // simulação até que os tributos sejam recalculados com sucesso. Não persistida.
  taxError?: boolean;
};
