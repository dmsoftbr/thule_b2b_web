import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "./-components/order-form";
import { v7 as uuidv7 } from "uuid";

export const Route = createFileRoute("/_app/orders/new-order")({
  component: NewOrderPage,
});

function NewOrderPage() {
  // const newOrder: OrderModel = {
  //   id: "",
  //   customerId: 0,
  //   createdAt: new Date(),
  //   representativeId: 0,
  //   carrierId: 0,
  //   orderRepId: "",
  //   deliveryLocationId: "",
  //   discountPercent: 0,
  //   integrationStatusId: "",
  //   paymentConditionId: 0,
  //   totalOrderValue: 0,
  //   statusId: "OPEN",
  //   whatsappNumber: "",
  //   approvedAt: new Date(),
  // };

  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Novo Pedido de Venda
      </h1>
      <OrderForm orderId={uuidv7()} action="NEW" orderType="ORDER" />
    </div>
  );
}
