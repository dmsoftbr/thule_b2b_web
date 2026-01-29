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
export const AddSalesGroupModal = ({ isOpen, customerId, onClose }: Props) => {
  const [selectedSalesGroupId, setSelectedSalesGroupId] = useState("");
  const [salesGroupData, setSalesGroupData] = useState<SearchComboItem[]>([]);
  const [comboKey, setComboKey] = useState(new Date().valueOf());
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    const data = {
      customerId,
      groupId: selectedSalesGroupId,
    };
    try {
      await api.post(`/registrations/customer-sales-group`, data);
      toast.success("Grupo de Venda Vinculada");
      onClose(true);
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const getSalesGroups = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/registrations/sales-groups/all`);
      const options = convertArrayToSearchComboItem(data, "id", "id", false);
      setSalesGroupData(options);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalesGroups();
    setComboKey(new Date().valueOf());
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Grupo de Venda</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <SearchCombo
            key={comboKey}
            onChange={(value) => setSelectedSalesGroupId(value)}
            staticItems={salesGroupData}
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
