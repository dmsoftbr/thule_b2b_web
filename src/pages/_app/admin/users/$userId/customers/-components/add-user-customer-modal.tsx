import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomersCombo } from "@/components/app/customers-combo";
import { api, handleError } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import type { CustomerModel } from "@/models/registrations/customer.model";

interface Props {
  isOpen: boolean;
  userId: string;
  onClose: (refresh: boolean) => void;
}

export const AddUserCustomerModal = ({ isOpen, userId, onClose }: Props) => {
  const [selectedCustomer, setSelectedCustomer] = useState<
    CustomerModel | undefined
  >(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedCustomer) {
      toast.warning("Selecione um cliente.");
      return;
    }
    try {
      setIsSaving(true);
      await api.post(`/admin/user-customers`, {
        userId,
        customerId: selectedCustomer.id,
      });
      toast.success("Cliente vinculado ao usuário.");
      onClose(true);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Cliente ao Usuário</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <CustomersCombo
            onSelect={(c) => setSelectedCustomer(c)}
            disabled={isSaving}
          />
        </div>
        <DialogFooter>
          <Button
            variant="green"
            disabled={isSaving || !selectedCustomer}
            onClick={() => handleSave()}
          >
            Adicionar
          </Button>
          <Button
            variant="secondary"
            disabled={isSaving}
            onClick={() => onClose(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
