import { api } from "@/lib/api";
import type { Esli011Model } from "@/models/stock/esli011.model";
import type { ProductPriceEstimatedDateModel } from "@/models/stock/product-price-estimated-date.model";
import type { StockModel } from "@/models/stock/stock.model";

export class StockService {
  private static basePath: string = "stock";

  static async getStockByPriceAndEstimatedDate(productId: string) {
    const { data } = await api.get<ProductPriceEstimatedDateModel>(
      `/${this.basePath}/product-price-estimated-date/${encodeURIComponent(productId)}`
    );
    return data;
  }

  static async getEsli011(productId: string) {
    const { data } = await api.get<Esli011Model>(
      `/${this.basePath}/esli011/${encodeURIComponent(productId)}`
    );
    return data;
  }

  static async getByProductId(productId: string) {
    const { data } = await api.get<StockModel[]>(
      `/${this.basePath}/product/${encodeURIComponent(productId)}`
    );
    return data;
  }

  static async getById({
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
