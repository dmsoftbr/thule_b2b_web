export type OutletCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  priceTableId: string;
  metadata?: Record<string, unknown>;
};
