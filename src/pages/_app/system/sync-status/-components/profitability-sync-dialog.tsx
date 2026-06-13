import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (initDate: Date, endDate: Date) => void;
};

/**
 * Período da sincronização do Profitability. A carga roda em lotes mensais no
 * Integrador, então períodos longos são seguros (só demoram mais).
 */
export const ProfitabilitySyncDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: Props) => {
  const [initDate, setInitDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 0, 1),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const handleConfirm = () => {
    if (!initDate || !endDate) {
      toast.warning("Informe o período completo (data inicial e final).");
      return;
    }
    if (initDate > endDate) {
      toast.warning("Data inicial maior que a data final.");
      return;
    }
    onConfirm(initDate, endDate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sincronizar Profitability</DialogTitle>
          <DialogDescription>
            Informe o período a sincronizar. Os dados do período serão
            substituídos pelos do ERP, mês a mês.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="flex flex-col gap-y-1">
            <Label className="text-xs text-muted-foreground">
              Data Inicial:
            </Label>
            <DatePicker
              defaultValue={initDate}
              onValueChange={setInitDate}
              placeholder="Data inicial"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-xs text-muted-foreground">
              Data Final:
            </Label>
            <DatePicker
              defaultValue={endDate}
              onValueChange={setEndDate}
              placeholder="Data final"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="blue" onClick={handleConfirm}>
            Sincronizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
