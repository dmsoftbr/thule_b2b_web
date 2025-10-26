import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { SettingModel } from "@/models/admin/setting.model";

export class SettingsService {
  private basePath: string = "admin/settings";

  async getAll(): Promise<SettingModel[]> {
    const response = await api.get<SettingModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  async getById(id: string): Promise<SettingModel> {
    const response = await api.get<SettingModel>(`/${this.basePath}/${id}`);
    return response.data;
  }

  async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<SettingModel>> {
    const response = await api.post<PagedResponseModel<SettingModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  async update(data: Partial<SettingModel>): Promise<SettingModel> {
    const response = await api.patch<SettingModel>(`/${this.basePath}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
