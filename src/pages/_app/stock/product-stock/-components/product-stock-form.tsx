import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCT_ACTIVE_STATES } from "@/constants";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import type { ProductPriceEstimatedDateModel } from "@/models/stock/product-price-estimated-date.model";
import { StockService } from "@/services/stock/stock.service";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ProductStockForm = () => {
  const [productId, setProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] =
    useState<ProductPriceEstimatedDateModel | null>(null);

  async function handleGetStock() {
    setIsLoading(true);
    try {
      const stockData =
        await StockService.getStockByPriceAndEstimatedDate(productId);
      setStockData(stockData);
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao tentar buscar o estoque no TOTVS");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Produto</Label>
        <div className="flex gap-x-1">
          <Input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            readOnly={isLoading}
          />
          <Button disabled={isLoading}>Buscar</Button>
          <Button disabled={isLoading} onClick={() => handleGetStock()}>
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            {!isLoading && <SearchIcon />}
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Descrição</Label>
        <Input readOnly value={stockData?.product.description} />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col space-y-2">
          <Label>Quantidade em Estoque</Label>
          <Input readOnly value={stockData?.stockAvailable} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Preço Unitário Sugerido</Label>
          <Input
            readOnly
            value={formatNumber(stockData?.suggestUnitPrice, 2)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col space-y-2">
          <Label>Situação</Label>
          <Input
            readOnly
            value={
              PRODUCT_ACTIVE_STATES[
                stockData?.product.isActive
                  ? stockData?.product.isActive - 1
                  : 3
              ]
            }
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Previsão de Chegada</Label>
          <Input readOnly value={formatDate(stockData?.estimatedDate)} />
        </div>
      </div>
    </div>
  );
};
