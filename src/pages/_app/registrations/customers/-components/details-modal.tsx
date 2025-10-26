import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DetailsModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Contato</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input />
          </div>
          <div className="space-y-1">
            <Label>Whastapp</Label>
            <Input />
          </div>
          <div className="space-y-1">
            <Label>Fone</Label>
            <Input />
          </div>
          <div className="space-y-1">
            <Label>Área / Cargo / Função</Label>
            <Input />
          </div>

          <div className="space-y-1">
            <Label>
              <Checkbox />
              Enviar Notificações App Mobile
            </Label>
          </div>
        </div>
        <DialogFooter className="mt-2 flex items-center justify-end">
          <Button onClick={onClose}>Gravar</Button>
          <Button onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
