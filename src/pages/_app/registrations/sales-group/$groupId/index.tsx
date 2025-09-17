import { createFileRoute, useParams } from "@tanstack/react-router";
import { SalesGroupForm } from "../-components/sales-group-form";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/_app/registrations/sales-group/$groupId/"
)({
  component: SalesGroupIdPageComponent,
});

function SalesGroupIdPageComponent() {
  const { groupId } = useParams({
    from: "/_app/registrations/sales-group/$groupId/",
  });

  return (
    <div>
      <SalesGroupForm formAction="EDIT" initialData={undefined} />
    </div>
  );
}
