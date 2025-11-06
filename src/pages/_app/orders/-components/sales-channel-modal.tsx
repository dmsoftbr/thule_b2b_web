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
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BoxIcon } from "lucide-react";
import { useState } from "react";

export const SalesChannelModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: treeData } = useQuery({
    queryKey: ["sales-group-tree-data", "teste"],
    queryFn: async () => {
      const { data } = await api.get<TreeNode[]>(
        `/registrations/sales-groups/grid/teste`
      );

      return data;
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <BoxIcon className="size-4" />
          Produtos do Canal de Venda
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[30%]">
        <DialogHeader>
          <DialogTitle>Produtos do seu Canal de Venda</DialogTitle>
          <DialogDescription>
            Produtos relacionados ao seu Canal de Venda
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-6 mt-2">
          <TreeView
            data={treeData ?? []}
            className="shadow-sm"
            searchable={true}
            searchPlaceholder="Buscar..."
            showSelectAllButtons={false}
            isReadOnly
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
