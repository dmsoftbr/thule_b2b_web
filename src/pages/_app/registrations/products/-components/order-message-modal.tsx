import type { ProductModel } from "@/models/product.model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ProductsService } from "@/services/registrations/products.service";
import { toast } from "sonner";

interface Props {
  initialData: ProductModel;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}
export const ProductOrderMessageModal = ({
  isOpen,
  initialData,
  onClose,
}: Props) => {
  const [msg, setMsg] = useState(initialData.orderMessage ?? "");

  const { mutate: updateProduct } = useMutation({
    mutationFn: () =>
      ProductsService.update({
        ...initialData,
        orderMessage: msg ?? "",
      }),
    onSuccess: () => {
      toast.success("Mensagem atualizada!");
      onClose(true);
    },
  });

  const handleSave = () => {
    updateProduct();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mensagem para Pedidos/Simulações</DialogTitle>
          <DialogDescription>
            Esta mensagem será exibida no momento que o usuário adicionar este
            produto a um pedido ou simulação.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            value={msg}
            onChange={(event) => setMsg(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => handleSave()}>Gravar</Button>
          <Button variant="secondary" size="sm" onClick={() => onClose(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
