import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { ApprovalLevelModel } from "@/models/registrations/approval-level.model";
import { ApprovalLevelLimitsService } from "@/services/registrations/approval-level-limits.service";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";
import { LimitsModal } from "./-components/limits-modal";

export const Route = createFileRoute("/_app/registrations/approval-levels/")({
  component: ApprovalLevelsPageComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "description",
    label: "Descrição",
  },
];

function ApprovalLevelsPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState<ApprovalLevelModel | null>(
    null
  );
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: `/registrations/approval-levels/new-level` });
  };

  const handleEdit = (data: ApprovalLevelModel) => {
    navigate({ to: `/registrations/approval-levels/${data.id}` });
  };

  const handleDelete = async (data: ApprovalLevelModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir esta Alçada de Aprovação?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueDelete) {
      await ApprovalLevelLimitsService.delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  const handleConfig = (data: ApprovalLevelModel) => {
    setCurrentData(data);
    setShowModal(true);
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Comunicados no App Mobile">
      <div className="p-2">
        <ServerTable<ApprovalLevelModel>
          key={tableToken}
          defaultSearchField="description"
          defaultSortFieldDataIndex="description"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
            fnConfig: handleConfig,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/registrations/approval-levels/list-paged"
        />
      </div>
      {showModal && currentData && (
        <LimitsModal
          approvalLevel={currentData}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setCurrentData(null);
          }}
        />
      )}
    </AppPageHeader>
  );
}
