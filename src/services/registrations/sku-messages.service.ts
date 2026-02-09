import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { SkuMessageModel } from "@/models/registrations/sku-message.model";

export class SkuMessagesService {
  private static basePath: string = "registrations/sku-messages";

  static async getAll(): Promise<SkuMessageModel[]> {
    const response = await api.get<SkuMessageModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<SkuMessageModel> {
    const response = await api.get<SkuMessageModel>(
      `/${this.basePath}/id/${id}`,
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<SkuMessageModel>> {
    const response = await api.post<PagedResponseModel<SkuMessageModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }

  static async create(
    data: Partial<SkuMessageModel>,
  ): Promise<SkuMessageModel> {
    const response = await api.post<SkuMessageModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<SkuMessageModel>,
  ): Promise<SkuMessageModel> {
    const response = await api.patch<SkuMessageModel>(
      `/${this.basePath}/${id}`,
      data,
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }

  static async send(id: string): Promise<void> {
    await api.post(`/${this.basePath}/send/${id}`);
  }
}
