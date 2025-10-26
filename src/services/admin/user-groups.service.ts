import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { UserGroupModel } from "@/models/user-group.model";

export class UserGroupsService {
  private basePath: string = "admin/user-groups";

  async getAll(): Promise<UserGroupModel[]> {
    const response = await api.get<UserGroupModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  async getById(id: string): Promise<UserGroupModel> {
    const response = await api.get<UserGroupModel>(`/${this.basePath}/${id}`);
    return response.data;
  }

  async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<UserGroupModel>> {
    const response = await api.post<PagedResponseModel<UserGroupModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  async create(data: Partial<UserGroupModel>): Promise<UserGroupModel> {
    const response = await api.post<UserGroupModel>(`/${this.basePath}`, data);
    return response.data;
  }

  async update(data: Partial<UserGroupModel>): Promise<UserGroupModel> {
    const response = await api.patch<UserGroupModel>(`/${this.basePath}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
