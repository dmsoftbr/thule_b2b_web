import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockService } from "@/services/stock/stock.service";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export const ProductStockForm = () => {
  const [productId, setProductId] = useState("");

  async function handleGetStock() {
    try {
      const stockData = await new StockService().getByProductId(productId);
      let stockQuantity = stockData.reduce(
        (acc, item) => (acc += item.AvailQuantity),
        0
      );
    } catch (error) {
      console.log(error);
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
          />
          <Button>Buscar</Button>
          <Button onClick={() => handleGetStock()}>
            <SearchIcon />
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Descrição</Label>
        <Input readOnly />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col space-y-2">
          <Label>Quantidade em Estoque</Label>
          <Input readOnly />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Preço Unitário Sugerido</Label>
          <Input readOnly />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col space-y-2">
          <Label>Situação</Label>
          <Input readOnly />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Previsão de Chegada</Label>
          <Input readOnly />
        </div>
      </div>
    </div>
  );
};
