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
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}
export const GenerateModal = ({ isOpen, onClose }: Props) => {
  const [anoOrigem, setAnoOrigem] = useState(new Date().getFullYear());
  const [anoDestino, setAnoDestino] = useState(new Date().getFullYear());
  const [percentual, setPercentual] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      await api.post("/registrations/representative-goals/generate", {
        anoOrigem,
        anoDestino,
        percentual,
      });
      onClose(true);
    } catch (error) {
      console.error(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Geração de Meta</DialogTitle>
          <DialogDescription>
            Utilize esta tela para gerar as metas com base nos dados do
            Profitability já importado automaticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          <div className="form-group">
            <Label>Utilizar qual Ano do Profitability como base?</Label>
            <Input
              readOnly={isLoading}
              type="number"
              min={2020}
              max={2072}
              step={1}
              value={anoOrigem.toString()}
              onChange={(e) => setAnoOrigem(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <Label>Gerar a Meta como sendo Ano?</Label>
            <Input
              readOnly={isLoading}
              type="number"
              min={2020}
              max={2072}
              step={1}
              value={anoDestino.toString()}
              onChange={(e) => setAnoDestino(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <Label>% de Reajuste:</Label>
            <NumericFormat
              readOnly={isLoading}
              decimalScale={2}
              decimalSeparator=","
              fixedDecimalScale
              min={0}
              max={1000}
              step={1}
              value={percentual}
              onValueChange={(value) => setPercentual(value.floatValue ?? 0)}
              className="form-input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            size="sm"
            onClick={() => handleGenerate()}
            type="button"
            disabled={isLoading}
            variant="green"
            className="flex items-center justify-center"
          >
            {isLoading ? (
              <span>
                <Loader2Icon className="animate-spin mr-1" />
                Aguarde...
              </span>
            ) : (
              <span>Gerar</span>
            )}
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => onClose(false)}
            type="button"
            variant="secondary"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
