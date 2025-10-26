import { AppPageHeader } from "@/components/layout/app-page-header";
import { MobileCommunicationsService } from "@/services/mobile/communications.service";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { MobileCommunicationForm } from "../-components/communication-form";

export const Route = createFileRoute(
  "/_app/mobile/communications/$communicationId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { communicationId } = useParams({
    from: "/_app/mobile/communications/$communicationId/",
  });

  const { data } = useQuery({
    queryKey: ["mobile-communication-id", communicationId],
    queryFn: async () => {
      const data = await MobileCommunicationsService.getById(communicationId);
      return data;
    },
    enabled: !!communicationId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Noticação: ${communicationId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <MobileCommunicationForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/mobile/communications" })}
        />
      </div>
    </AppPageHeader>
  );
}
