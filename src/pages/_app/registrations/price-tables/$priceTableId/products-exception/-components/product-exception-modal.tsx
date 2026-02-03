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
export const ProductExceptionModal = ({
  isOpen,
  priceTableId,
  onClose,
}: Props) => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [productsData, setProductsData] = useState<SearchComboItem[]>([]);
  const [branchesData, setBranchesData] = useState<SearchComboItem[]>([]);
  const [comboKey, setComboKey] = useState(new Date().valueOf());
  const [comboKey2, setComboKey2] = useState(new Date().valueOf());
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    const data = {
      priceTableId,
      productId: selectedProductId,
      branchId: selectedBranchId,
    };
    try {
      await api.post(`/registrations/price-table-products-exception`, data);
      toast.success("Excessão registrada com sucesso");
      onClose(true);
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/registrations/prices/price-table/${priceTableId}`,
      );
      const options = convertArrayToSearchComboItem(
        data,
        "id",
        "description",
        true,
      );
      setProductsData(options);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
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
    getProducts();
    getBranches();
    setComboKey(new Date().valueOf());
    setComboKey2(new Date().valueOf());
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excessão de Produto na Tabela de Preço</DialogTitle>
          <DialogDescription>
            Use esta opção para bloquear a venda de determinados produtos no
            estabelecimento informado
          </DialogDescription>
        </DialogHeader>
        <div className="form-group">
          <Label>Produto</Label>
          <SearchCombo
            key={comboKey}
            onChange={(value) => setSelectedProductId(value)}
            staticItems={productsData}
            disabled={isLoading}
          />
          <Label className="!mt-2">Estabelecimento</Label>
          <SearchCombo
            key={comboKey2}
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
