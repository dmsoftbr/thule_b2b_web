import type { PriceExceptionTableModel } from "./price-exception-table.model";

export type CustomerPriceExceptionTableModel = {
  customerId: number;
  exceptionTableId: string;
  order: number;
  exceptionTable?: PriceExceptionTableModel;
};
