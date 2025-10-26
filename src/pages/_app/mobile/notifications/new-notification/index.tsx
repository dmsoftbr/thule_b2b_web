import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileNotificationForm } from "../-components/notification-form";

export const Route = createFileRoute(
  "/_app/mobile/notifications/new-notification/"
)({
  component: NewMobileNotificationPage,
});

function NewMobileNotificationPage() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot="Nova Notificação para o App Mobile">
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <MobileNotificationForm
          initialData={null}
          isOpen={true}
          onClose={() => navigate({ to: "/mobile/notifications" })}
          mode={"ADD"}
        />
      </div>
    </AppPageHeader>
  );
}
