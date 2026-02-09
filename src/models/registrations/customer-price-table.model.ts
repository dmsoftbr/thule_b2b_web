import type { PriceTableModel } from "./price-table.model";
import type { CustomerModel } from "./customer.model";

export type CustomerPriceTableModel = {
  customerId: number;
  priceTableId: string;
  customer?: CustomerModel;
  priceTable?: PriceTableModel;
  isException: boolean;
  order: number;
};
