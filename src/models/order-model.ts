import type { OrderItemModel } from "./order-item-model";
import type { PriceTableModel } from "./registrations/price-table.model";
import type { CustomerModel } from "./registrations/customer.model";
import type { RepresentativeModel } from "./representative.model";

export type OrderModel = {
  id: string;
  customerId: number;
  orderRepId: string;
  createdAt: Date;
  approvedAt?: Date;
  representativeId: number;
  carrierId: number;
  deliveryLocationId: string;
  paymentConditionId: number;
  whatsappNumber: string;
  totalOrderValue: number;
  discountPercent: number;
  statusId: string;
  integrationStatusId: string;
  priceTableId: string;
  items: OrderItemModel[];
  representative?: RepresentativeModel;
  priceTable?: PriceTableModel;
  customer?: CustomerModel;
  branchId: string;
  portalId: string;
  isBudget: boolean;
};
