import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApprovalLevelLimitModel } from "@/models/registrations/approval-level-limit.model";
import type { ApprovalLevelModel } from "@/models/registrations/approval-level.model";
import { limitsColumns } from "./limits-columns";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { NumericFormat } from "react-number-format";
import { api, handleError } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { toast } from "sonner";
import * as uuid from "uuid";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  approvalLevel: ApprovalLevelModel;
}

export const LimitsModal = ({ isOpen, onClose, approvalLevel }: Props) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [limitId, setLimitId] = useState("");
  const [usersData, setUsersData] = useState<SearchComboItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("");
  const [limitValue, setLimitValue] = useState(0);
  const [tableToken, setTableToken] = useState(new Date().valueOf());

  const handleEdit = (data: ApprovalLevelLimitModel) => {
    setIsAdding(false);
    setLimitId(data.id);
    setLimitValue(data.limitValue);
    setSelectedUser(data.userId);
    setSelectedAlternative(data.alternativeId);
    setShowAddModal(true);
  };

  const handleDelete = async (data: ApprovalLevelLimitModel) => {
    await api.delete(`/registrations/approval-level-limits/${data.id}`);
    setTableToken(new Date().valueOf());
  };

  const handleAdd = () => {
    setIsAdding(true);
    setLimitId(uuid.v4());
    setLimitValue(0);
    setShowAddModal(true);
  };

  const getUsersData = async () => {
    const { data } = await api.get("/admin/users/all");

    setUsersData(convertArrayToSearchComboItem(data, "id", "id", false));
  };

  const handleSave = async () => {
    if (!selectedUser) {
      toast.warning("Selecione o Usuário que será Aprovador");
      return;
    }
    if (selectedUser == selectedAlternative) {
      toast.warning("Alternativo selecionado não pode ser igual ao Aprovador");
      return;
    }

    const param = {
      userId: selectedUser,
      alternativeId: selectedAlternative,
      limitValue,
      levelId: approvalLevel.id,
      id: limitId,
    };
    try {
      if (isAdding) {
        await api.post("/registrations/approval-level-limits", param);
        setShowAddModal(false);
      } else {
        await api.patch("/registrations/approval-level-limits", param);
        setShowAddModal(false);
      }
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setTableToken(new Date().valueOf());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4/12">
        <DialogHeader>
          <DialogTitle>
            Configuração de Usuários / Limites: {approvalLevel.description}
          </DialogTitle>
          <DialogDescription>
            Utilize esta tela para configurar quem terá acesso a aprovação.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <ServerTable<ApprovalLevelLimitModel>
            key={tableToken}
            columns={limitsColumns({
              fnEdit: handleEdit,
              fnDelete: handleDelete,
            })}
            dataUrl="/registrations/approval-level-limits/list-paged"
            additionalInfo={{ levelId: approvalLevel.id }}
            searchFields={[
              {
                id: "userId",
                label: "Usuário",
              },
            ]}
            defaultSearchField="userId"
            onAdd={() => handleAdd()}
          />
          {showAddModal && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-neutral-900/30 z-[1000]"></div>
              <div className="bg-neutral-200 z-[1001] min-w-full p-10 rounded-lg">
                <div className="space-y-2">
                  <div className="form-group">
                    <Label>Usuário</Label>
                    <SearchCombo
                      defaultValue={
                        usersData.filter((f) => f.value == selectedUser) ??
                        undefined
                      }
                      staticItems={usersData}
                      onChange={(value) => {
                        setSelectedUser(value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <Label>Alternativo</Label>
                    <SearchCombo
                      defaultValue={
                        usersData.filter(
                          (f) => f.value == selectedAlternative
                        ) ?? undefined
                      }
                      staticItems={usersData}
                      onChange={(value) => {
                        setSelectedAlternative(value);
                      }}
                      deSelectOnClick
                    />
                  </div>
                  <div className="form-group">
                    <Label>Limite R$</Label>
                    <NumericFormat
                      decimalScale={2}
                      fixedDecimalScale
                      className="form-input"
                      decimalSeparator=","
                      thousandSeparator="."
                      allowNegative={false}
                      value={limitValue}
                      onValueChange={(e) => setLimitValue(e.floatValue ?? 0)}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <Button onClick={() => handleSave()}>Gravar</Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onClose()}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
