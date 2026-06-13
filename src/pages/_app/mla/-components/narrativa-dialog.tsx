import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type NarrativaAction = "aprovar" | "reprovar";

interface Props {
  action: NarrativaAction | null;
  count: number;
  isSubmitting: boolean;
  onConfirm: (narrativa: string) => void;
  onClose: () => void;
}

// Modal de narrativa para aprovar/reprovar em lote (narrativa ≤ 2000 chars, como o legado).
export function NarrativaDialog({
  action,
  count,
  isSubmitting,
  onConfirm,
  onClose,
}: Props) {
  const [narrativa, setNarrativa] = useState("");

  useEffect(() => {
    if (action) setNarrativa("");
  }, [action]);

  const isReject = action === "reprovar";

  return (
    <Dialog open={!!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReject ? "Reprovar" : "Aprovar"} {count}{" "}
            {count === 1 ? "pendência" : "pendências"}
          </DialogTitle>
          <DialogDescription>
            Informe a narrativa da {isReject ? "reprovação" : "aprovação"}.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={narrativa}
          onChange={(e) => setNarrativa(e.target.value.slice(0, 2000))}
          placeholder="Narrativa (máx. 2000 caracteres)"
          rows={5}
          maxLength={2000}
        />
        <div className="text-right text-xs text-muted-foreground">
          {narrativa.length}/2000
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant={isReject ? "destructive" : "default"}
            onClick={() => onConfirm(narrativa)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processando..."
              : isReject
                ? "Reprovar"
                : "Aprovar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
