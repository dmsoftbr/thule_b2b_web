import {
  TreeView,
  type TreeNode,
} from "@/components/tree-checkbox/tree-checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, handleError } from "@/lib/api";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const EMPTY_DATA: TreeNode[] = [];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupData: SalesGroupModel;
}
export const DetailsModal = ({ groupData, isOpen, onClose }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data: treeData } = useQuery({
    queryKey: ["sales-group-tree-data", groupData.id],
    queryFn: async () => {
      const { data } = await api.get<TreeNode[]>(
        `/registrations/sales-groups/grid/${groupData.id}`,
      );

      return data;
    },
    enabled: !!groupData,
  });

  async function handleSave() {
    try {
      setIsSaving(true);
      await api.post(`/registrations/sales-groups/grid/${groupData.id}`, [
        ...selectedIds,
      ]);
      toast.success("Detalhamento gravado com sucesso!");
      onClose();
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSaving(false);
    }
  }

  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-fit md:min-w-[70%]">
        <DialogHeader>
          <DialogTitle>Detalhamento do Grupo de Vendas</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <Label>Grupo de Vendas</Label>
            <Input readOnly value={groupData.id} />
          </div>
          <div>
            <TreeView
              data={treeData ?? EMPTY_DATA}
              onSelectionChange={handleSelectionChange}
              className="shadow-sm"
              searchable={true}
              searchPlaceholder="Buscar..."
              showSelectAllButtons={true}
            />
          </div>
        </div>
        <DialogFooter className="!justify-between">
          <div className="text-xs bg-amber-200 rounded py-1 px-2 w-fit h-fit items-center">
            Tipo Item / Família Comercial / Grupo de Estoque / Família Material
            / Características / Tipo Produto / Grupo de Item
          </div>
          <div>
            <Button disabled={isSaving} onClick={() => handleSave()}>
              Gravar
            </Button>
            <Button onClick={onClose} variant="secondary">
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
