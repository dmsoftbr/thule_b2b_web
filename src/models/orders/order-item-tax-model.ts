export type OrderItemTaxModel = {
  id: string;
  orderId: string;
  itemId: string;
  taxName: string;
  taxValue: number;
  taxPercentual: number;
  taxBaseReduction: number;
  taxBase: number;
};
