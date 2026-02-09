import { api, handleError } from "@/lib/api";
import type { UserPermissionModel } from "@/models/admin/user-permission.model";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import type { OrderModel } from "@/models/orders/order-model";
import { CustomersService } from "@/services/registrations/customers.service";
import { ProductsService } from "@/services/registrations/products.service";
import { RepresentativesService } from "@/services/registrations/representatives.service";
import { toast } from "sonner";

export const NEW_ORDER_EMPTY: OrderModel = {
  id: "",
  customerId: 0,
  createdAt: new Date(),
  representativeId: 0,
  carrierId: 0,
  orderClassificationId: 1,
  deliveryLocationId: "",
  discountPercentual: 0,
  integrationMessage: "",
  paymentConditionId: 0,
  grossTotalValue: 0,
  netTotalValue: 0,
  statusId: 0,
  whatAppPhoneNumber: "",
  branchId: "",
  items: [],
  isBudget: false,
  fiscalOperationId: "",
  isCompleted: false,
  isParcialBilling: true,
  comments: "",
  additionalDiscount: 0,
  createdBy: "",
  creditStatusId: 1,
  currencyId: 0,
  customerAbbreviation: "",
  erpOrderId: 0,
  freightPayedValue: 0,
  freightPaymentId: 1,
  freightTypeId: 1,
  freightValue: 0,
  orderId: "",
  orderRepId: "",
  origin: "",
  priceTypeId: 1,
  useCustomerCarrier: false,
};

export const NEW_ORDER_ITEM_EMPTY: Omit<
  OrderItemModel,
  "priceTable" | "product" | "taxes"
> = {
  orderId: "",
  sequence: 0,
  productId: "",
  orderQuantity: 0,
  availability: "",
  deliveryDate: new Date(),
  inputPrice: 0,
  priceTablePrice: 0,
  suggestPrice: 0,
  priceTableId: "",
  grossItemValue: 0,
  allocatedQuantity: 0,
  comments: "",
  customerAbbreviation: "",
  deliveredQuantity: 0,
  fiscalOperationId: "",
  id: "",
  ncm: "",
  netItemValue: 0,
  originalDeliveryDate: new Date(),
  referenceCode: "",
  statusId: 1,
  costValue: 0,
};

export const NEW_BUDGET_EMPTY: OrderModel = {
  id: "",
  customerId: 0,
  createdAt: new Date(),
  representativeId: 0,
  carrierId: 0,
  deliveryLocationId: "",
  discountPercentual: 0,
  integrationMessage: "",
  paymentConditionId: 0,
  grossTotalValue: 0,
  netTotalValue: 0,
  orderClassificationId: 1,
  statusId: 0,
  whatAppPhoneNumber: "",
  branchId: "",
  items: [],
  isBudget: true,
  fiscalOperationId: "",
  isCompleted: false,
  comments: "",
  additionalDiscount: 0,
  currencyId: 0,
  createdBy: "",
  creditStatusId: 1,
  customerAbbreviation: "",
  erpOrderId: 0,
  freightPayedValue: 0,
  freightPaymentId: 0,
  freightTypeId: 1,
  freightValue: 0,
  isParcialBilling: true,
  orderId: "",
  orderRepId: "",
  origin: "",
  priceTypeId: 1,
  useCustomerCarrier: false,
};

export const generateOrderFromOutlet = async (): Promise<OrderModel> => {
  const newOrder = { ...NEW_ORDER_EMPTY };

  const outletJson = JSON.parse(
    sessionStorage.getItem("b2b@outletOrderData") ?? "",
  );

  if (outletJson) {
    sessionStorage.removeItem("b2b@outletOrderData");
    localStorage.removeItem("outlet_cart_v1");
    newOrder.customerId = Number(outletJson.customerId);
    newOrder.representativeId = outletJson.customer.representativeId;
    newOrder.branchId = outletJson.customer.branchId;
    newOrder.currencyId = 0;
    newOrder.statusId = 1;
    newOrder.discountPercentual = 0;
    newOrder.orderClassificationId = 6; // outlet

    const repData = await new RepresentativesService().getById(
      newOrder.representativeId,
    );
    newOrder.representative = repData;

    //const customerData = await CustomersService.getById(newOrder.customerId);
    newOrder.customer = outletJson.customer;
    newOrder.carrierId = outletJson.customer.carrierId;
    newOrder.customerAbbreviation = outletJson.customer.abbreviation;
    newOrder.deliveryLocationId =
      outletJson.customer.deliveryLocations?.length > 0
        ? outletJson.customer.deliveryLocations[0].id
        : "";
    for (const [index, item] of (outletJson.items ?? []).entries()) {
      const orderItem: OrderItemModel = {
        ...NEW_ORDER_ITEM_EMPTY,
        product: item.product,
        taxes: [],
        priceTable: item.priceTable,
      };
      orderItem.availability = "C";
      orderItem.orderQuantity = item.quantity;
      orderItem.productId = item.id;
      orderItem.priceTableId = item.priceTableId;
      orderItem.sequence = (index + 1) * 10;
      orderItem.inputPrice = item.price;
      orderItem.suggestPrice = item.price;
      const productData = await ProductsService.getById(item.id);
      orderItem.product = productData;

      newOrder.items.push(orderItem);
    }
  }
  return newOrder;
};

export const getUserPermissions = async (userId: string) => {
  try {
    const { data } = await api.get<UserPermissionModel[]>(
      `/admin/users/permissions/${userId}`,
    );

    return data;
  } catch (error) {
    toast.error(handleError(error));
  }
};

export const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "C":
      return "bg-emerald-500 text-white";
    case "B":
      return "bg-red-300 text-white";
    case "B2":
      return "bg-red-500 text-white";
    case "B3":
      return "bg-pink-500 text-white";
    case "B4":
      return "bg-purple-500 text-white";
    case "P":
      return "bg-blue-300 text-white";
    default:
      return "bg-neutral-200 text-white";
  }
};
