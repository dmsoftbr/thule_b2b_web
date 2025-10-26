import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { SyncStatusService } from "@/services/system/sync-status.service";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/system/sync-status/")({
  component: SyncStatusComponent,
});

function SyncStatusComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["sync-status"],
    queryFn: async () => {
      const data = await SyncStatusService.get();
      return data;
    },
  });

  return (
    <AppPageHeader titleSlot="Sincronização do Sistema">
      <div className="mt-4 px-2 pb-4">
        <ServerTable<any>
          columns={columns()}
          dataUrl={""}
          items={data}
          isPending={isLoading}
          defaultPageSize={0}
          defaultSearchField="tableName"
          searchFields={[
            {
              id: "tableName",
              label: "Item",
            },
          ]}
        ></ServerTable>
      </div>
    </AppPageHeader>
  );
}
