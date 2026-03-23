import type { ProductModel } from "../product.model";
import type { PriceTableModel } from "../registrations/price-table.model";

export type OutletCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  priceTableId: string;
  metadata?: Record<string, unknown>;
  product?: ProductModel;
  priceTable?: PriceTableModel;
};
