import type { OutletCartItem } from "@/models/outlet/outlet-cart-item.model";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type OutletCartContextType = {
  items: OutletCartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<OutletCartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "outlet_cart_v1";

const OutletCartContext = createContext<OutletCartContextType | undefined>(
  undefined
);

export const OutletCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<OutletCartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as OutletCartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures
    }
  }, [items]);

  const addItem = (item: Omit<OutletCartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === item.id && p.priceTableId == item.priceTableId
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((s, i) => s + i.quantity * i.price, 0),
    [items]
  );

  const value: OutletCartContextType = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
  };

  return (
    <OutletCartContext.Provider value={value}>
      {children}
    </OutletCartContext.Provider>
  );
};

export const useOutletCart = (): OutletCartContextType => {
  const ctx = useContext(OutletCartContext);
  if (!ctx)
    throw new Error("useOutletCart must be used within an OutletCartProvider");
  return ctx;
};
