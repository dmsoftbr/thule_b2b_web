import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ItemTypeModel } from "@/models/registrations/item-type.model";

export class ItemTypesService {
  private static basePath: string = "registrations/item-types";

  static async getAll(): Promise<ItemTypeModel[]> {
    const response = await api.get<ItemTypeModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<ItemTypeModel> {
    const response = await api.get<ItemTypeModel>(`/${this.basePath}/id/${id}`);
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<ItemTypeModel>> {
    const response = await api.post<PagedResponseModel<ItemTypeModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }

  static async create(data: Partial<ItemTypeModel>): Promise<ItemTypeModel> {
    const response = await api.post<ItemTypeModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<ItemTypeModel>,
  ): Promise<ItemTypeModel> {
    const response = await api.patch<ItemTypeModel>(
      `/${this.basePath}/${id}`,
      data,
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
