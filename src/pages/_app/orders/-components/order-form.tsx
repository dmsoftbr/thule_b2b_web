import { Button } from "@/components/ui/button";
import { OrderFormItems } from "./order-form-items";
import { OrderFormHeader } from "./order-form-header";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SalesChannelModal } from "./sales-channel-modal";
import { FinishOrderModal } from "./finish-order-modal";
import { ExportOrder } from "./export-order";
import { useOrder } from "../-context/order-context";

export const OrderForm = () => {
  const navigate = useNavigate();

  const [showFinishOrderModal, setShowFinishOrderModal] = useState(false);
  const { order, mode, isBudget, clearAll } = useOrder();

  const isEditing = mode != "VIEW";

  // Enquanto algum item está calculando impostos, o pedido ainda não tem os
  // valores finais — bloqueia cancelar e concluir até o cálculo terminar.
  const anyItemLoadingTaxes = order.items.some((i) => i.isLoadingTaxes);

  // Atalho Ctrl+/ (ou Cmd+/) abre o modal de Concluir Pedido / Simulação.
  // Só dispara se houver itens — espelha a regra do disabled do botão.
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const isCtrlSlash = (e.ctrlKey || e.metaKey) && e.key === "/";
      if (!isCtrlSlash) return;
      if (order.items.length === 0) return;
      if (anyItemLoadingTaxes) return;
      if (showFinishOrderModal) return;
      e.preventDefault();
      setShowFinishOrderModal(true);
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [order.items.length, showFinishOrderModal, anyItemLoadingTaxes]);

  return (
    <>
      <div
        className="flex flex-col space-y-2 relative overflow-hidden container ml-auto mr-auto border"
        style={{ height: "calc(100vh - 110px" }}
      >
        <OrderFormHeader />
        <OrderFormItems />
        <div className="absolute bottom-0 right-0 left-0 bg-neutral-100 border-t px-2 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {/* <DiscountMatrizModal /> */}
            <SalesChannelModal />

            {!isEditing && <ExportOrder />}
          </div>
          <div className="flex items-center justify-end gap-x-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={anyItemLoadingTaxes}
              onClick={() => {
                clearAll();
                navigate({ to: isBudget ? "/budgets" : "/orders" });
              }}
            >
              Cancelar
            </Button>

            <Button
              disabled={order.items.length == 0 || anyItemLoadingTaxes}
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
