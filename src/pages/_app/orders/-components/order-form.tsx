import { Button } from "@/components/ui/button";
import { OrderFormItems } from "./order-form-items";
import { OrderFormHeader } from "./order-form-header";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { generateOrderFromOutlet } from "../-utils/order-utils";
import { DiscountMatrizModal } from "./discount-matriz-modal";
import { SalesChannelModal } from "./sales-channel-modal";
import { FinishOrderModal } from "./finish-order-modal";
import { toast } from "sonner";
import { handleError } from "@/lib/api";
import { ExportOrder } from "./export-order";
import { useOrder } from "../-context/order-context";

// interface Props {
//   //orderId: string;
//   //action: "NEW" | "VIEW" | "APPROVAL" | "CANCEL" | "EDIT";
//   //orderType: "ORDER" | "BUDGET";
// }

//export const OrderForm = ({ orderId, orderType, action }: Props) => {
export const OrderForm = () => {
  const navigate = useNavigate();

  const [showFinishOrderModal, setShowFinishOrderModal] = useState(false);
  const {
    order,
    setOrder,
    setCustomer,
    setRepresentative,
    setDiscountPercentual,
    mode,
    isBudget,
  } = useOrder();

  const isEditing = mode == "NEW" || mode == "EDIT";

  const handleSetOrderFromOutlet = async () => {
    try {
      const outletOrderData =
        sessionStorage.getItem("b2b@outletOrderData") ?? "";
      if (outletOrderData) {
        const orderGenerated = await generateOrderFromOutlet();
        sessionStorage.removeItem("b2b@outletOrderData");
        //        if (orderGenerated.priceTable) setPriceTable(orderGenerated.priceTable);
        if (orderGenerated.customer) setCustomer(orderGenerated.customer);
        if (orderGenerated.representative)
          setRepresentative(orderGenerated.representative);
        setDiscountPercentual(0);
        setOrder(orderGenerated);
      }
    } catch (error) {
      console.log(error);
      toast.error(handleError(error));
    }
  };

  useEffect(() => {
    handleSetOrderFromOutlet();
  }, []);

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
              {isEditing}
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
