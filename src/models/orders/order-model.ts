import type { CustomerModel } from "../registrations/customer.model";
import type { PriceTableModel } from "../registrations/price-table.model";
import type { RepresentativeModel } from "../representative.model";
import type { OrderItemModel } from "./order-item-model";

export type OrderModel = {
  id: string;
  erpOrderId?: number;
  customerId: number;
  customerAbbreviation?: string;
  createdAt: Date;
  statusId: number;
  deliveryLocationId: string;
  integrationMessage?: string;
  integratedAt?: Date;
  branchId: string;
  discountPercentual: number;
  currencyId?: number;
  representativeId: number;
  orderClassificationId?: number;
  createdBy?: string;
  isParcialBilling?: boolean;
  useCustomerCarrier?: boolean;
  minBillingDate?: Date;
  maxBillingDate?: Date;
  paymentConditionId: number;
  isBudget: boolean;
  freightValue?: number;
  freightPaymentId?: number;
  carrierId: number;
  whatAppPhoneNumber: string;
  comments?: string;
  freightPayedValue?: number;
  indAdditionalDiscount?: boolean;
  grossTotalValue?: number;
  netTotalValue?: number;
  creditStatusId?: number;
  freightTypeId?: number;
  origin?: string;
  priceTableId: string;
  fiscalClassificationId: string;
  isCompleted: boolean;

  // Navigation properties
  items: OrderItemModel[];
  customer?: CustomerModel;
  representative?: RepresentativeModel;
  priceTable?: PriceTableModel;
};
