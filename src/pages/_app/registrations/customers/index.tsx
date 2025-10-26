import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { CustomersTable } from "./-components/customers-table";

export const Route = createFileRoute("/_app/registrations/customers/")({
  component: CustomersPageComponent,
});

function CustomersPageComponent() {
  return (
    <AppPageHeader titleSlot="Clientes">
      <CustomersTable />
    </AppPageHeader>
  );
}
