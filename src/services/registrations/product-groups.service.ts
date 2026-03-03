import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ProductGroupModel } from "@/models/registrations/product-group.model";

export class ProductGroupsService {
  private static basePath: string = "registrations/product-groups";

  static async getAll(): Promise<ProductGroupModel[]> {
    const response = await api.get<ProductGroupModel[]>(
      `/${this.basePath}/all`,
    );
    return response.data;
  }

  static async getById(id: string): Promise<ProductGroupModel> {
    const response = await api.get<ProductGroupModel>(
      `/${this.basePath}/id/${id}`,
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<ProductGroupModel>> {
    const response = await api.post<PagedResponseModel<ProductGroupModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }
}
