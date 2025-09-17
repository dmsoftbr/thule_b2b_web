import { createFileRoute, useParams } from "@tanstack/react-router";
import { SalesGroupForm } from "../-components/sales-group-form";

export const Route = createFileRoute(
  "/_app/registrations/sales-group/$groupId/"
)({
  component: SalesGroupIdPageComponent,
});

function SalesGroupIdPageComponent() {
  const { groupId } = useParams({
    from: "/_app/registrations/sales-group/$groupId/",
  });
  console.log(groupId);

  return (
    <div>
      <SalesGroupForm formAction="EDIT" initialData={undefined} />
    </div>
  );
}
