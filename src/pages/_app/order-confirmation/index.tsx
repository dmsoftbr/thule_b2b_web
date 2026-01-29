import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { createFileRoute } from "@tanstack/react-router";
import { columns } from "./-components/columns";
import type { OrderItemModel } from "@/models/orders/order-item-model";

export const Route = createFileRoute("/_app/order-confirmation/")({
  component: OrderConfirmationPageComponent,
});

function OrderConfirmationPageComponent() {
  const handleView = async (item: OrderItemModel) => {
    //
    console.log(item);
  };

  const handleConfirm = async (item: OrderItemModel) => {
    //
    console.log(item);
  };

  const handleReject = async (item: OrderItemModel) => {
    //
    console.log(item);
  };

  return (
    <AppPageHeader titleSlot="Confirmação de Pedido">
      {/* table */}
      <div className="p-2">
        <ServerTable
          columns={columns({
            fnConfirm: handleConfirm,
            fnView: handleView,
            fnReject: handleReject,
          })}
          dataUrl={""}
          searchFields={[]}
          showAddButton={false}
          showAdvancedFilter
          advancedFilterSlot={<div>aki</div>}
        />
      </div>
    </AppPageHeader>
  );
}
