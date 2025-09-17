import { api } from "@/lib/api";
import type { StockModel } from "@/models/stock/stock.model";

export class StockService {
  private basePath: string = "stock";

  async getByProductId(productId: string) {
    const { data } = await api.get<StockModel[]>(
      `/${this.basePath}/product/${productId}`
    );
    return data;
  }

  async getById({
    branchId,
    warehouseId,
    localizationId,
    productId,
    batchCode,
  }: {
    branchId: string;
    warehouseId: string;
    localizationId: string;
    productId: string;
    batchCode: string;
  }) {
    const { data } = await api.post<StockModel[]>(`/${this.basePath}`, {
      branchId,
      warehouseId,
      localizationId,
      productId,
      batchCode,
    });
    return data;
  }
}
