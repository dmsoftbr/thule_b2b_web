import type { CustomerModel } from "./customer.model";
import type { SalesGroupModel } from "./sales-group.model";

export type CustomerSalesGroupModel = {
  customerId: number;
  groupId: string;
  customer?: CustomerModel;
  salesGroup?: SalesGroupModel;
};
