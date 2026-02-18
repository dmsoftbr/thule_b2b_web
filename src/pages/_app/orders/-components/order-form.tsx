import { Button } from "@/components/ui/button";
import { OrderFormItems } from "./order-form-items";
import { OrderFormHeader } from "./order-form-header";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DiscountMatrizModal } from "./discount-matriz-modal";
import { SalesChannelModal } from "./sales-channel-modal";
import { FinishOrderModal } from "./finish-order-modal";
import { ExportOrder } from "./export-order";
import { useOrder } from "../-context/order-context";

export const OrderForm = () => {
  const navigate = useNavigate();

  const [showFinishOrderModal, setShowFinishOrderModal] = useState(false);
  const { order, mode, isBudget } = useOrder();

  const isEditing = mode != "VIEW";

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
            <DiscountMatrizModal />
            <SalesChannelModal />

            {!isEditing && <ExportOrder />}
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
              disabled={order.items.length == 0}
              size="sm"
              type="button"
              onClick={() => setShowFinishOrderModal(true)}
            >
              {isEditing
                ? `Concluir ${isBudget ? "Simulação" : "Pedido"}`
                : "Ver Resumo"}
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
