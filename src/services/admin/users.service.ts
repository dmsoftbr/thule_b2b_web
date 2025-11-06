import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { UserModel } from "@/models/user.model";

export class UsersService {
  private basePath: string = "admin/users";

  async getAll(): Promise<UserModel[]> {
    const response = await api.get<UserModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  async getById(id: string, onlyActive: boolean = true): Promise<UserModel> {
    const response = await api.get<UserModel>(
      `/${this.basePath}/${id}?onlyActives=${onlyActive}`
    );
    return response.data;
  }

  async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<UserModel>> {
    const response = await api.post<PagedResponseModel<UserModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  async create(data: Partial<UserModel>): Promise<UserModel> {
    const response = await api.post<UserModel>(`/${this.basePath}`, data);
    return response.data;
  }

  async update(data: Partial<UserModel>): Promise<UserModel> {
    const response = await api.patch<UserModel>(`/${this.basePath}`, data);
    return response.data;
  }

  async changePassword(
    userId: string,
    newPassword: string
  ): Promise<UserModel> {
    const data = {
      userId,
      newPassword,
    };
    const response = await api.patch<UserModel>(
      `/${this.basePath}/change-password`,
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
