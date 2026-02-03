import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  priceTableId: string;
  onClose: (refresh: boolean) => void;
}
export const BranchExceptionModal = ({
  isOpen,
  priceTableId,
  onClose,
}: Props) => {
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [branchesData, setBranchesData] = useState<SearchComboItem[]>([]);
  const [comboKey, setComboKey] = useState(new Date().valueOf());
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    const data = {
      priceTableId,
      branchId: selectedBranchId,
    };
    try {
      await api.post(`/registrations/price-table-branches-exception`, data);
      toast.success("Excessão registrada com sucesso");
      onClose(true);
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const getBranches = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/registrations/branches/all`);
      const options = convertArrayToSearchComboItem(data, "id", "id", false);
      setBranchesData(options);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBranches();
    setComboKey(new Date().valueOf());
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Excessão de Estabelecimentos na Tabela de Preço
          </DialogTitle>
          <DialogDescription>
            Use esta opção para forçar que os produtos da tabela de preço sejam
            faturados por um estabelecimento da lista. Caso não tenha nenhum
            estabelecimento definido, todos serão permitidos.
          </DialogDescription>
        </DialogHeader>
        <div className="form-group">
          <Label className="!mt-2">Estabelecimento</Label>
          <SearchCombo
            key={comboKey}
            onChange={(value) => setSelectedBranchId(value)}
            staticItems={branchesData}
            disabled={isLoading}
          />
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
