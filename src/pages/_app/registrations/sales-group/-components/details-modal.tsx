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
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const EMPTY_DATA: TreeNode[] = [];

const IS_ACTIVE_BADGE: Record<
  number,
  { text: string; className: string }
> = {
  1: {
    text: "Ativo",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  2: {
    text: "Obsoleto Ordens Automáticas",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  3: {
    text: "Obsoleto Todas as Ordens",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  4: {
    text: "Totalmente Obsoleto",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const decorateLeafBadges = (nodes: TreeNode[]): TreeNode[] =>
  nodes.map((node) => {
    const hasChildren = !!node.children && node.children.length > 0;
    if (hasChildren) {
      return { ...node, children: decorateLeafBadges(node.children!) };
    }
    const isActive = (node.data as { isActive?: number } | undefined)?.isActive;
    const badge = isActive ? IS_ACTIVE_BADGE[isActive] : undefined;
    return badge ? { ...node, badge } : node;
  });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupData: SalesGroupModel;
}

export interface SaveRulesRequest {
  salesGroupId: string;
  selectedPathIds: string[];
}

export const saveCommercialRules = async (
  salesGroupId: string,
  selectedPathIds: string[],
): Promise<void> => {
  try {
    const payload: SaveRulesRequest = {
      salesGroupId,
      selectedPathIds,
    };

    await api.post(
      `/registrations/sales-groups/grid/${encodeURIComponent(salesGroupId)}`,
      payload,
    );
  } catch (error) {
    console.log(error);
    toast.error(handleError(error));
  }
};

export const DetailsModal = ({ groupData, isOpen, onClose }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  async function handleSave() {
    try {
      setIsSaving(true);
      await saveCommercialRules(groupData.id, selectedIds);
      toast.success("Detalhamento gravado com sucesso!");
      //onClose();
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSaving(false);
    }
  }

  const getTreeData = async () => {
    const { data } = await api.get<TreeNode[]>(
      `/registrations/sales-groups/grid/${encodeURIComponent(groupData.id)}`,
    );
    setTreeData(decorateLeafBadges(data));
  };

  const handleSelectionChange = useCallback((ids: string[]) => {
    console.log("SELCT", ids);
    setSelectedIds(ids);
  }, []);

  useEffect(() => {
    if (isOpen) {
      getTreeData();
    }
  }, [isOpen]);

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
          <div className="flex items-center justify-center gap-x-2">
            <Button disabled={isSaving} onClick={() => handleSave()}>
              {isSaving ? (
                <div>
                  <Loader2Icon className="size-3 animate-spin" />
                  Gravando...
                </div>
              ) : (
                <span>Gravar</span>
              )}
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
