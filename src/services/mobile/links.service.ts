import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { MobileLinkModel } from "@/models/mobile/link.model";

export class MobileLinksService {
  private static basePath: string = "mobile/links";

  static async getAll(): Promise<MobileLinkModel[]> {
    const response = await api.get<MobileLinkModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<MobileLinkModel> {
    const response = await api.get<MobileLinkModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<MobileLinkModel>> {
    const response = await api.post<PagedResponseModel<MobileLinkModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  static async create(
    data: Partial<MobileLinkModel>
  ): Promise<MobileLinkModel> {
    const response = await api.post<MobileLinkModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<MobileLinkModel>
  ): Promise<MobileLinkModel> {
    const response = await api.patch<MobileLinkModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
