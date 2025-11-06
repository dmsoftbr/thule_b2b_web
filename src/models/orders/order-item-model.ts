import type { ProductModel } from "../product.model";

export type OrderItemModel = {
  sequence: number;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceSuggest: number;
  unitPriceBase: number;
  totalValue: number;
  deliveryDate: Date;
  availability: string;
  priceTableId: string;
  product?: ProductModel;
};
