import { AppPageHeader } from "@/components/layout/app-page-header";
import { MobileLinksService } from "@/services/mobile/links.service";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { MobileLinkForm } from "../-components/link-form";

export const Route = createFileRoute("/_app/mobile/links/$linkId/")({
  component: MobileLinkIdPageComponent,
});

function MobileLinkIdPageComponent() {
  const navigate = useNavigate();
  const { linkId } = useParams({
    from: "/_app/mobile/links/$linkId/",
  });

  const { data } = useQuery({
    queryKey: ["mobile-link-id", linkId],
    queryFn: async () => {
      const data = await MobileLinksService.getById(linkId);
      return data;
    },
    enabled: !!linkId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Noticação: ${linkId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <MobileLinkForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/mobile/links" })}
        />
      </div>
    </AppPageHeader>
  );
}
