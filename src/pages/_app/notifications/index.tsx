import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageHeader titleSlot="Notificações">
      <div></div>
    </AppPageHeader>
  );
}
