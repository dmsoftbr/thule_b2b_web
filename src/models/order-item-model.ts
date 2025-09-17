import type { ProductModel } from "./product.model";

export type OrderItemModel = {
  id: number;
  orderId: number;
  productId: string;
  quantity: number;
  unitPriceSuggest: number;
  unitPriceBase: number;
  totalValue: number;
  deliveryDate: Date;
  availability: string;
  product: ProductModel;
  portalId: string;
};
