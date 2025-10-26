import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { SettingsForm } from "../-components/setting-form";
import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/admin/settings.service";
import { AppPageHeader } from "@/components/layout/app-page-header";

export const Route = createFileRoute("/_app/admin/settings/$settingId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { settingId } = useParams({ from: "/_app/admin/settings/$settingId/" });

  const { data } = useQuery({
    queryKey: ["setting-id", settingId],
    queryFn: async () => {
      const data = await new SettingsService().getById(settingId);
      return data;
    },
    enabled: !!settingId,
  });

  if (!data) return;

  return (
    <AppPageHeader titleSlot={`Alterar Configuração: ${settingId}`}>
      <div className="p-2">
        <SettingsForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/admin/settings" })}
        />
      </div>
    </AppPageHeader>
  );
}
