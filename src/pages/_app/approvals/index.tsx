import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { OrderModel } from "@/models/orders/order-model";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/approvals/")({
  component: ApprovalsPageComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
];

function ApprovalsPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());

  const handleView = (order: OrderModel) => {
    //
    console.log(order);
    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader titleSlot={"Aprovações"}>
      <div className="p-2">
        <ServerTable<OrderModel>
          key={tableToken}
          defaultSearchField="title"
          defaultSortFieldDataIndex="title"
          searchFields={searchFieldsList}
          columns={columns({
            fnView: handleView,
          })}
          showAddButton
          dataUrl="/approvals/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
