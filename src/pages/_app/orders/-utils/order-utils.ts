import type { OrderModel } from "@/models/order-model";
import { v7 as uuidv7 } from "uuid";

export const NEW_ORDER_EMPTY: OrderModel = {
  id: "",
  customerId: 0,
  createdAt: new Date(),
  representativeId: 0,
  carrierId: 0,
  orderRepId: "",
  deliveryLocationId: "",
  discountPercent: 0,
  integrationStatusId: "",
  paymentConditionId: 0,
  totalOrderValue: 0,
  statusId: "OPEN",
  whatsappNumber: "",
  priceTableId: "",
  branchId: "",
  items: [],
  portalId: uuidv7(),
};
