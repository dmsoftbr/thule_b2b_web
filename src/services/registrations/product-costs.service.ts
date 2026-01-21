import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ProductCostModel } from "@/models/registrations/product-cost.model";

export class ProductCostsService {
  private static basePath: string = "registrations/product-costs";

  static async getAll(): Promise<ProductCostModel[]> {
    const response = await api.get<ProductCostModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(
    branchId: string,
    productId: string,
  ): Promise<ProductCostModel> {
    const response = await api.get<ProductCostModel>(
      `/${this.basePath}/id/${branchId}/${productId}`,
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<ProductCostModel>> {
    const response = await api.post<PagedResponseModel<ProductCostModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }
}
