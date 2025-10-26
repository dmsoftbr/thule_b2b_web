import { createFileRoute, useParams } from "@tanstack/react-router";
import { SalesGroupForm } from "../-components/sales-group-form";
import { SalesGroupsService } from "@/services/registrations/sales-group.service";
import { useEffect, useState } from "react";
import { AppPageHeader } from "@/components/layout/app-page-header";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";

export const Route = createFileRoute(
  "/_app/registrations/sales-group/$groupId/"
)({
  component: SalesGroupIdPageComponent,
});

function SalesGroupIdPageComponent() {
  const [data, setData] = useState<SalesGroupModel>();
  const { groupId } = useParams({
    from: "/_app/registrations/sales-group/$groupId/",
  });

  async function getData() {
    if (groupId) {
      const response = await SalesGroupsService.getById(groupId);
      if (response) {
        setData(response);
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);
  if (!data) {
    return null;
  }
  return (
    <AppPageHeader titleSlot="Grupos de Venda">
      <div className="container ml-auto mr-auto max-w-lg my-4">
        <SalesGroupForm formAction="EDIT" initialData={data} />
      </div>
    </AppPageHeader>
  );
}
