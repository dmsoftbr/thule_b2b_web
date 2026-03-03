import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ProductFamilyModel } from "@/models/product-family.model";

export class ProductFamiliesService {
  private static basePath: string = "registrations/product-families";

  static async getAll(): Promise<ProductFamilyModel[]> {
    const response = await api.get<ProductFamilyModel[]>(
      `/${this.basePath}/all`,
    );
    return response.data;
  }

  static async getById(id: string): Promise<ProductFamilyModel> {
    const response = await api.get<ProductFamilyModel>(
      `/${this.basePath}/id/${id}`,
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<ProductFamilyModel>> {
    const response = await api.post<PagedResponseModel<ProductFamilyModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }
}
