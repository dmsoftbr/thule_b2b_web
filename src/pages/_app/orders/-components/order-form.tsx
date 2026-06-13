import { Button } from "@/components/ui/button";
import { OrderFormItems } from "./order-form-items";
import { OrderFormHeader } from "./order-form-header";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SalesChannelModal } from "./sales-channel-modal";
import { FinishOrderModal } from "./finish-order-modal";
import { ExportOrder } from "./export-order";
import { useOrder } from "../-context/order-context";
import { useReturnTo } from "@/hooks/use-return-to";

export const OrderForm = () => {
  const navigate = useNavigate();

  const [showFinishOrderModal, setShowFinishOrderModal] = useState(false);
  const { order, mode, isBudget, clearAll } = useOrder();

  const isEditing = mode != "VIEW";

  // Destino do "Voltar": vem do search param `from` (ex.: /approvals quando
  // aberto pela tela de aprovações), com fallback para a lista padrão.
  const backTo = useReturnTo(isBudget ? "/budgets" : "/orders");

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
        style={{ height: "calc(100vh - 130px)" }}
      >
        {/* O conteúdo rolável precisa reservar a altura do rodapé fixo para não
            ser sobreposto. pb-20 cobre o rodapé empilhado em telas estreitas. */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden pb-20 sm:pb-16">
          <OrderFormHeader />
          <OrderFormItems />
        </div>
        <div className="absolute bottom-0 right-0 left-0 bg-neutral-100 border-t px-2 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {/* <DiscountMatrizModal /> */}
            <SalesChannelModal />

            {!isEditing && <ExportOrder />}
          </div>
          <div className="flex items-center justify-end gap-2 sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={anyItemLoadingTaxes}
              onClick={() => {
                clearAll();
                navigate({ to: backTo });
              }}
            >
              {isEditing ? "Cancelar" : "Voltar"}
            </Button>

            <Button
              disabled={order.items.length == 0 || anyItemLoadingTaxes}
              size="sm"
              className="flex-1 sm:flex-none"
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
