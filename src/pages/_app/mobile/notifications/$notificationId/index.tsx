import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { MobileNotificationForm } from "../-components/notification-form";
import { useQuery } from "@tanstack/react-query";
import { MobileNotificationsService } from "@/services/mobile/notifications.service";

export const Route = createFileRoute(
  "/_app/mobile/notifications/$notificationId/"
)({
  component: MobileNotificationIdPageComponent,
});

function MobileNotificationIdPageComponent() {
  const navigate = useNavigate();
  const { notificationId } = useParams({
    from: "/_app/mobile/notifications/$notificationId/",
  });

  const { data } = useQuery({
    queryKey: ["mobile-notification-id", notificationId],
    queryFn: async () => {
      const data = await MobileNotificationsService.getById(notificationId);
      return data;
    },
    enabled: !!notificationId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Noticação: ${notificationId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <MobileNotificationForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/mobile/notifications" })}
        />
      </div>
    </AppPageHeader>
  );
}
