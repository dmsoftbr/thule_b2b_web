import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";

export class SalesGroupsService {
  private static basePath: string = "registrations/sales-groups";

  static async getAll(): Promise<SalesGroupModel[]> {
    const response = await api.get<SalesGroupModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<SalesGroupModel> {
    const response = await api.get<SalesGroupModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<SalesGroupModel>> {
    const response = await api.post<PagedResponseModel<SalesGroupModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  static async create(
    data: Partial<SalesGroupModel>
  ): Promise<SalesGroupModel> {
    const response = await api.post<SalesGroupModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    data: Partial<SalesGroupModel>
  ): Promise<SalesGroupModel> {
    const response = await api.patch<SalesGroupModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
