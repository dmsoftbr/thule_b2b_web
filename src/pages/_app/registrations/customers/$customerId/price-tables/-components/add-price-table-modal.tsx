import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
export const AddPriceTableModal = ({ isOpen, customerId, onClose }: Props) => {
  const [selectedPriceTableId, setSelectedPriceTableId] = useState("");
  const [priceTablesData, setPriceTablesData] = useState<SearchComboItem[]>([]);
  const [comboKey, setComboKey] = useState(new Date().valueOf());
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    const data = {
      customerId,
      priceTableId: selectedPriceTableId,
    };
    try {
      await api.post(`/registrations/customer-price-tables`, data);
      toast.success("Tabela de Preço Vinculada");
      onClose(true);
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const getPriceTables = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/registrations/price-tables/all`);
      const options = convertArrayToSearchComboItem(data, "id", "id", false);
      setPriceTablesData(options);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPriceTables();
    setComboKey(new Date().valueOf());
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Tabela de Preço</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <SearchCombo
            key={comboKey}
            onChange={(value) => setSelectedPriceTableId(value)}
            staticItems={priceTablesData}
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
