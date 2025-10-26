import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { MobileCommunicationModel } from "@/models/mobile/communication.model";

export class MobileCommunicationsService {
  private static basePath: string = "mobile/communications";

  static async getAll(): Promise<MobileCommunicationModel[]> {
    const response = await api.get<MobileCommunicationModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  static async getById(id: string): Promise<MobileCommunicationModel> {
    const response = await api.get<MobileCommunicationModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<MobileCommunicationModel>> {
    const response = await api.post<
      PagedResponseModel<MobileCommunicationModel>
    >(`/${this.basePath}/list-paged`, request);
    return response.data;
  }

  static async create(
    data: Partial<MobileCommunicationModel>
  ): Promise<MobileCommunicationModel> {
    const response = await api.post<MobileCommunicationModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<MobileCommunicationModel>
  ): Promise<MobileCommunicationModel> {
    const response = await api.patch<MobileCommunicationModel>(
      `/${this.basePath}/${id}`,
      data
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
