// store/useOrder.ts
import { create } from "zustand";
import type { RepresentativeModel } from "@/models/representative.model";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import { NEW_ORDER_EMPTY } from "../-utils/order-utils";

import type { CustomerModel } from "@/models/registrations/customer.model";
import type { OrderModel } from "@/models/orders/order-model";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import type { DeliveryLocationModel } from "@/models/delivery-location.model";

type OrderState = {
  currentOrder: OrderModel;
  setCurrentOrder: (order: OrderModel | undefined) => void;
  clearItems: () => void;
  setCustomer: (customer: CustomerModel) => void;
  setPriceTable: (priceTable: PriceTableModel) => void;
  setRepresentative: (representative: RepresentativeModel | undefined) => void;
  setDiscountPercent: (percent: number) => void;
  setDeliveryLocation: (deliveryLocation: DeliveryLocationModel) => void;
  onAddItem: (item: OrderItemModel) => void;
  onRemoveItem: (item: OrderItemModel) => void;
  onUpdateItem: (item: OrderItemModel) => void;
};

export const useOrder = create<OrderState>((set) => ({
  currentOrder: NEW_ORDER_EMPTY, // inicial vazio
  setCurrentOrder: (order) => set({ currentOrder: order }),
  clearItems: () =>
    set((state) =>
      state.currentOrder
        ? { currentOrder: { ...state.currentOrder, items: [] } }
        : state
    ),
  setCustomer: (customer) =>
    set((state) => handleChangeCustomer(state, customer)),
  setPriceTable: (priceTable) =>
    set((state) => handleChangePriceTable(state, priceTable)),
  setRepresentative: (representative) =>
    set((state) => handleChangeRepresentative(state, representative)),
  setDeliveryLocation: (deliveryLocaiton) =>
    set((state) => handleChangeDeliveryLocation(state, deliveryLocaiton)),
  setDiscountPercent: (percent) =>
    set((state) => handleChangeDiscountPercent(state, percent)),
  onAddItem: (item) => set((state) => handleAddItem(state, item)),
  onRemoveItem: (item) => set((state) => handleRemoveItem(state, item)),
  onUpdateItem: (item) => set((state) => handleUpdateItem(state, item)),
}));

const handleChangeRepresentative = (
  state: OrderState,
  representative: RepresentativeModel | undefined
) => {
  if (state.currentOrder) {
    const newOrder: OrderModel = {
      ...state.currentOrder,
      representative: representative,
      representativeId: representative?.id ?? 0,
    };
    return { currentOrder: newOrder };
  } else return state;
};

const handleChangeDeliveryLocation = (
  state: OrderState,
  deliveryLocation: DeliveryLocationModel | undefined
) => {
  if (state.currentOrder) {
    const newOrder: OrderModel = {
      ...state.currentOrder,
      deliveryLocation: deliveryLocation,
      deliveryLocationId: deliveryLocation?.id ?? "",
    };
    return { currentOrder: newOrder };
  } else return state;
};

const handleChangeDiscountPercent = (state: OrderState, percent: number) => {
  if (state.currentOrder) {
    const newOrder: OrderModel = {
      ...state.currentOrder,
      discountPercentual: percent,
    };
    return { currentOrder: newOrder };
  } else return state;
};

const handleChangeCustomer = (state: OrderState, customer: CustomerModel) => {
  if (state.currentOrder) {
    const newOrder: OrderModel = {
      ...state.currentOrder,
      customer,
      customerId: customer.id,
      branchId: customer.branchId,
      paymentConditionId: customer.paymentConditionId,
    };
    return { currentOrder: newOrder };
  } else return state;
};

const handleChangePriceTable = (
  state: OrderState,
  priceTable: PriceTableModel
) => {
  if (state.currentOrder) {
    const newOrder: OrderModel = {
      ...state.currentOrder,
      priceTable,
      priceTableId: priceTable.id,
    };
    return { currentOrder: newOrder };
  } else return state;
};

const handleAddItem = (state: OrderState, item: OrderItemModel) => {
  const newItems = state.currentOrder.items;
  newItems?.push(item);
  return { currentOrder: { ...state.currentOrder, items: newItems } };
};

const handleUpdateItem = (state: OrderState, item: OrderItemModel) => {
  const newItems = state.currentOrder.items;
  const itemIndex =
    state.currentOrder.items?.findIndex(
      (f) => f.productId === item.productId && f.sequence == item.sequence
    ) ?? -1;

  if (itemIndex >= 0 && newItems) {
    newItems[itemIndex].orderQuantity = item.orderQuantity;
    newItems[itemIndex].deliveryDate = item.deliveryDate;
    newItems[itemIndex].availability = item.availability;
  }

  return { currentOrder: { ...state.currentOrder, items: newItems } };
};

const handleRemoveItem = (state: OrderState, item: OrderItemModel) => {
  const newItems =
    state.currentOrder.items?.filter((f) => f.sequence != item.sequence) ?? [];
  return { currentOrder: { ...state.currentOrder, items: newItems } };
};
