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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BoxIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrder } from "../-context/order-context";

export const SalesChannelModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { order } = useOrder();
  const queryClient = useQueryClient();

  const { data: treeData } = useQuery({
    queryKey: ["sales-group-tree-data"],
    queryFn: async () => {
      if (
        !order.customer ||
        !order.customer.salesGroup ||
        order.customer.salesGroup.length == 0
      ) {
        return [];
      }
      const { data } = await api.get<TreeNode[]>(
        `/registrations/sales-groups/grid/${order.customer.salesGroup[0].groupId}`,
      );
      return data;
    },
    enabled: !!order.customer,
  });

  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({
        queryKey: ["sales-group-tree-data"],
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={order.customerId <= 0}
        >
          <BoxIcon className="size-4" />
          Produtos do Canal de Venda
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
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
