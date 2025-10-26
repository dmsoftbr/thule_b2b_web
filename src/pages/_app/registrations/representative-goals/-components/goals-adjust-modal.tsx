import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}

export const GoalsAdjustModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aplicar Ajuste</DialogTitle>
          <DialogDescription>
            Utilize esta tela para realizar os ajustes de metas de forma mais
            granular.
          </DialogDescription>
        </DialogHeader>
        <div>ss</div>
      </DialogContent>
    </Dialog>
  );
};
