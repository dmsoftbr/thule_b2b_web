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
import { api } from "@/lib/api";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";
import { useQuery } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupData: SalesGroupModel;
}
export const DetailsModal = ({ groupData, isOpen, onClose }: Props) => {
  const { data: treeData } = useQuery({
    queryKey: ["sales-group-tree-data", groupData.id],
    queryFn: async () => {
      const { data } = await api.get<TreeNode[]>(
        `/registrations/sales-groups/grid/${groupData.id}`
      );

      return data;
    },
    enabled: !!groupData,
  });

  // const treeData: TreeNode[] = [
  //   {
  //     id: "12",
  //     label: "Bike Carriers",
  //     children: [
  //       {
  //         id: "1.1",
  //         label: "AWN",
  //         children: [
  //           { id: "1.1.1", label: "Boxes & Baskets" },
  //           { id: "1.1.2", label: "Luggage&Duffels" },
  //           { id: "1.1.3", label: "Other RV" },
  //         ],
  //       },
  //       {
  //         id: "1.2",
  //         label: "WIN",
  //         children: [
  //           { id: "1.2.1", label: "Boxes & Baskets" },
  //           { id: "1.2.2", label: "Luggage&Duffels" },
  //           { id: "1.2.3", label: "Other RV" },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "14",
  //     label: "Adventure Camping",
  //     children: [
  //       { id: "2.1", label: "PROF" },
  //       { id: "2.2", label: "BIKECAR" },
  //       {
  //         id: "2.3",
  //         label: "Screenshots",
  //         children: [
  //           { id: "2.3.1", label: "Boxes & Baskets" },
  //           { id: "2.3.2", label: "Luggage&Duffels" },
  //           { id: "2.3.3", label: "Other RV" },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "60",
  //     label: "Bags",
  //     children: [
  //       { id: "60.73", label: "CBS" },
  //       { id: "60.79", label: "OTHAWK" },
  //     ],
  //   },
  // ];

  async function handleSave() {
    //
  }

  const handleSelectionChange = (selectedIds: string[]) => {
    console.log("Itens selecionados:", selectedIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-7/12">
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
              data={treeData ?? []}
              onSelectionChange={handleSelectionChange}
              className="shadow-sm"
              searchable={true}
              searchPlaceholder="Buscar..."
              showSelectAllButtons={true}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleSave()}>Gravar</Button>
          <Button onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
