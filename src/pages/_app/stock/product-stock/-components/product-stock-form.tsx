import { SearchProductModal } from "@/components/app/search-product-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCT_ACTIVE_STATES } from "@/constants";
import { handleError } from "@/lib/api";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import type { ProductPriceEstimatedDateModel } from "@/models/stock/product-price-estimated-date.model";
import { StockService } from "@/services/stock/stock.service";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ProductStockForm = () => {
  const [productId, setProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] =
    useState<ProductPriceEstimatedDateModel | null>(null);

  async function getData(itemId: string = "") {
    if (!productId && !itemId) return;
    setIsLoading(true);
    try {
      const stockData = await StockService.getStockByPriceAndEstimatedDate(
        itemId ? itemId : productId,
      );
      setStockData(stockData);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setStockData(null);
  }, [productId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Produto</Label>
        <div className="flex gap-x-1">
          <Input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            readOnly={isLoading}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                getData();
              }
            }}
          />
          <SearchProductModal
            onSelect={(product) => {
              if (product) {
                setProductId(product.id);
                getData(product.id);
              }
            }}
          />
          <Button
            disabled={isLoading}
            onClick={() => getData()}
            variant="secondary"
          >
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            {!isLoading && <CheckIcon />}
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Descrição</Label>
        <Input
          readOnly
          value={stockData ? stockData.product.description : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col space-y-2">
          <Label>Quantidade em Estoque</Label>
          <Input readOnly value={stockData ? stockData.stockAvailable : ""} />
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
                stockData?.product.isActive ? stockData?.product.isActive : 0
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
