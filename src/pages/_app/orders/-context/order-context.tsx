import type { OrderModel } from "@/models/orders/order-model";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { NEW_ORDER_EMPTY } from "../-utils/order-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";
import type { RepresentativeModel } from "@/models/representative.model";
import type { DeliveryLocationModel } from "@/models/delivery-location.model";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import * as uuid from "uuid";

interface OrderContextType {
  order: OrderModel;
  setOrder: (order: OrderModel) => void;
  setCustomer: (customer: CustomerModel) => void;
  setDiscountPercentual: (discountPercentual: number) => void;
  clearItems: () => void;
  setRepresentative: (representative: RepresentativeModel) => void;
  setDeliveryLocation: (deliveryLocation: DeliveryLocationModel) => void;
  addItem: (item: OrderItemModel) => void;
  removeItem: (item: OrderItemModel) => void;
  updateItem: (item: OrderItemModel) => void;
  getTotalOrderWithDiscount: () => number;
  getOrderTotalTaxes: () => number;
  mode: "NEW" | "EDIT" | "VIEW";
  setMode: (mode: "NEW" | "EDIT" | "VIEW") => void;
  isBudget: boolean;
  setIsBudget: (type: boolean) => void;
  clearAll: () => void;
}

// Create the context with a default undefined value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Define the props for the OrderProvider
interface OrderProviderProps {
  children: ReactNode;
  initialOrder?: OrderModel;
  formMode?: "NEW" | "EDIT" | "VIEW";
  // Permite forçar o modo simulação na criação (quando initialOrder é undefined,
  // como em /budgets/new-budget). Sem isso, o context só conseguiria saber que
  // é simulação ao carregar uma simulação existente.
  isBudget?: boolean;
}

// Create the OrderProvider component
export const OrderProvider: React.FC<OrderProviderProps> = ({
  children,
  initialOrder,
  formMode,
  isBudget: isBudgetProp,
}) => {
  const isBudget = initialOrder?.isBudget ?? isBudgetProp ?? false;
  const [order, setOrder] = useState<OrderModel>(() => {
    return initialOrder ?? { ...NEW_ORDER_EMPTY, items: [], isBudget };
  });
  const [mode, setMode] = useState<"NEW" | "EDIT" | "VIEW">(() => {
    return formMode ?? "VIEW";
  });

  const setIsBudget = (type: boolean) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      isBudget: type,
    }));
  };

  const setCustomer = (customer: CustomerModel) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      customer,
      customerId: customer.id,
      branchId: customer.branchId,
      paymentConditionId: customer.paymentConditionId,
      paymentCondition: customer.paymentCondition,
    }));
  };

  const setDiscountPercentual = (discountPercentual: number) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      discountPercentual,
    }));
  };

  const clearAll = () => {
    // Preserva isBudget — definido pela rota (/orders vs /budgets), não pelo
    // payload do pedido. Resetar para NEW_ORDER_EMPTY perdia esse contexto e
    // fazia simulação ser gravada como pedido.
    setOrder({ ...NEW_ORDER_EMPTY, items: [], isBudget });
  };

  const clearItems = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: [],
    }));
  };

  const setRepresentative = (representative: RepresentativeModel) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      representativeId: representative.id,
      representative: representative,
    }));
  };

  const setDeliveryLocation = (deliveryLocation: DeliveryLocationModel) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      deliveryLocationId: deliveryLocation.id,
      deliveryLocation: deliveryLocation,
    }));
  };

  const addItem = (item: OrderItemModel) => {
    item.id = uuid.v4();
    const newItems = [...order.items, item];
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: newItems,
    }));
  };

  const updateItem = (item: OrderItemModel) => {
    const newItems = [...order.items.filter((f) => f.id != item.id), item];
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: newItems,
    }));
  };

  const removeItem = (item: OrderItemModel) => {
    const newItems = [...order.items.filter((f) => f.id != item.id)];
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: newItems,
    }));
  };

  const getTotalOrderWithDiscount = () => {
    return order.items.reduce(
      (acc, b) => acc + b.orderQuantity * b.inputPrice,
      0,
    );
  };

  const getOrderTotalTaxes = () => {
    let total = 0;
    for (let item of order.items) {
      if (item.taxes)
        total += item.taxes.reduce((acc, b) => acc + b.taxValue, 0);
    }
    return total;
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        setOrder,
        setCustomer,
        setDiscountPercentual,
        clearItems,
        clearAll,
        setRepresentative,
        setDeliveryLocation,
        addItem,
        updateItem,
        removeItem,
        getTotalOrderWithDiscount,
        getOrderTotalTaxes,
        mode,
        setMode,
        isBudget,
        setIsBudget,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the OrderContext
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
