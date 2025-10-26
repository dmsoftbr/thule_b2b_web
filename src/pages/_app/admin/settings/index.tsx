import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { SettingModel } from "@/models/admin/setting.model";
import { columns } from "./-components/columns";
import { AppPageHeader } from "@/components/layout/app-page-header";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "name",
    label: "Nome",
  },
];

export const Route = createFileRoute("/_app/admin/settings/")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const navigate = useNavigate();

  const handleEdit = (data: SettingModel) => {
    navigate({ to: `/admin/settings/${data.id}` });
  };

  return (
    <AppPageHeader titleSlot="Lista de Configurações do Portal">
      <div className="p-2">
        <ServerTable<SettingModel>
          defaultSearchField="name"
          defaultSortFieldDataIndex="name"
          searchFields={searchFieldsList}
          columns={columns({ fnEdit: handleEdit })}
          showAddButton={false}
          dataUrl="/admin/settings/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
