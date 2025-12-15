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
  fiscalClassificationId: "",
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
  fiscalClassificationId: "",
  id: "",
  ncm: "",
  netItemValue: 0,
  originalDeliveryDate: new Date(),
  referenceCode: "",
  statusId: 1,
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
  fiscalClassificationId: "",
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
    sessionStorage.getItem("b2b@outletOrderData") ?? ""
  );

  if (outletJson) {
    sessionStorage.removeItem("b2b@outletOrderData");
    newOrder.customerId = Number(outletJson.customerId);
    newOrder.representativeId = 1;
    newOrder.branchId = "1";
    newOrder.currencyId = 0;
    newOrder.statusId = 1;
    newOrder.discountPercentual = 0;
    newOrder.orderClassificationId = 6; // outlet

    const repData = await new RepresentativesService().getById(1);
    newOrder.representative = repData;

    const customerData = await CustomersService.getById(newOrder.customerId);
    newOrder.customer = customerData;
    newOrder.carrierId = customerData.carrierId;
    newOrder.customerAbbreviation = customerData.abbreviation;
    newOrder.deliveryLocationId =
      customerData.deliveryLocations?.length > 0
        ? customerData.deliveryLocations[0].id
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
      `/admin/users/permissions/${userId}`
    );

    return data;
  } catch (error) {
    toast.error(handleError(error));
  }
};

export const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "C":
      return "bg-green-100 text-green-800 border-green-200";
    case "B":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "B2":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
