import { Button } from "@/components/ui/button";
import { OrderFormItems } from "./order-form-items";
import { OrderFormHeader } from "./order-form-header";
import { AvailabilityModal } from "./availability-modal";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useOrder } from "../-hooks/use-order";
import { NEW_ORDER_EMPTY } from "../-utils/order-utils";
import { DiscountMatrizModal } from "./discount-matriz-modal";
import { SalesChannelModal } from "./sales-channel-modal";
import { FinishOrderModal } from "./finish-order-modal";

interface Props {
  orderId: string;
  action: "NEW" | "VIEW" | "APPROVAL" | "CANCEL";
}

export const OrderForm = ({ orderId, action }: Props) => {
  const navigate = useNavigate();
  const [showFinishOrderModal, setShowFinishOrderModal] = useState(false);
  const { currentOrder, setCurrentOrder } = useOrder();

  useEffect(() => {
    console.log(orderId);
    if (action === "NEW") {
      setCurrentOrder(NEW_ORDER_EMPTY);
    }
  }, [action]);

  return (
    <>
      <div
        className="flex flex-col space-y-2 relative overflow-hidden container ml-auto mr-auto border"
        style={{ height: "calc(100vh - 110px" }}
      >
        <OrderFormHeader />
        <OrderFormItems />
        <div className="absolute bottom-0 right-0 left-0 bg-neutral-100 border-t px-2 py-2 flex items-center justify-between">
          <div className="flex gap-x-2">
            <AvailabilityModal />
            <DiscountMatrizModal />
            <SalesChannelModal />
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/orders" })}
            >
              Cancelar
            </Button>

            <Button
              disabled={currentOrder.items.length == 0}
              size="sm"
              type="button"
              onClick={() => setShowFinishOrderModal(true)}
            >
              Concluir Pedido
            </Button>
          </div>
        </div>
      </div>
      {showFinishOrderModal && (
        <FinishOrderModal
          isOpen={showFinishOrderModal}
          onClose={() => setShowFinishOrderModal(false)}
        />
      )}
    </>
  );
};
