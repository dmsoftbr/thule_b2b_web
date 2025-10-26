import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { GoalsTable } from "./-components/goals-table.tsx";

export const Route = createFileRoute(
  "/_app/registrations/representative-goals/"
)({
  component: RepresentativeGoalsPageComponent,
});

function RepresentativeGoalsPageComponent() {
  return (
    <AppPageHeader titleSlot="Metas de Representates">
      <div className="p-2">
        <GoalsTable />
      </div>
    </AppPageHeader>
  );
}
