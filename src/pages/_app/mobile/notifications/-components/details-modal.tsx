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
import type { MobileNotificationModel } from "@/models/mobile/notification.model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notificationData: MobileNotificationModel;
}
export const DetailsModal = ({ notificationData, isOpen, onClose }: Props) => {
  async function handleSave() {
    //
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhamento do Grupo de Vendas</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <Label>Entrega de Notificação</Label>
            <Input readOnly value={notificationData.id} />
          </div>
          <div></div>
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
