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
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { api, handleError } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  customerId: number;
  onClose: (refresh: boolean) => void;
}

export const AddExceptionTableModal = ({
  isOpen,
  customerId,
  onClose,
}: Props) => {
  const [selectedTableId, setSelectedTableId] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [tablesData, setTablesData] = useState<SearchComboItem[]>([]);
  const [comboKey, setComboKey] = useState(new Date().valueOf());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const data = {
      customerId,
      exceptionTableId: selectedTableId,
      order,
    };
    try {
      await api.post(`/registrations/customer-price-exception-table`, data);
      toast.success("Grupo de desconto vinculado");
      onClose(true);
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const getTables = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/registrations/price-exception-tables/all`,
      );
      setTablesData(convertArrayToSearchComboItem(data, "id", "name", true));
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTables();
    setComboKey(new Date().valueOf());
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Grupo de Desconto</DialogTitle>
          <DialogDescription>
            A ordem define a prioridade: quando o mesmo produto aparece em mais
            de um grupo do cliente, vence a de maior ordem.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Grupo de Desconto</Label>
            <SearchCombo
              key={comboKey}
              onChange={(value) => setSelectedTableId(value)}
              staticItems={tablesData}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="order">Ordem (prioridade)</Label>
            <Input
              id="order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="green" onClick={() => handleSave()}>
            Adicionar
          </Button>
          <Button variant="secondary" onClick={() => onClose(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
