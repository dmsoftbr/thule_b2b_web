import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ProductCommercialFamilyModel } from "@/models/registrations/product-commercial-family.model";

export class ProductCommercialFamiliesService {
  private static basePath: string = "registrations/product-commercial-families";

  static async getAll(): Promise<ProductCommercialFamilyModel[]> {
    const response = await api.get<ProductCommercialFamilyModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  static async getById(id: string): Promise<ProductCommercialFamilyModel> {
    const response = await api.get<ProductCommercialFamilyModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<ProductCommercialFamilyModel>> {
    const response = await api.post<
      PagedResponseModel<ProductCommercialFamilyModel>
    >(`/${this.basePath}/list-paged`, request);
    return response.data;
  }
}
