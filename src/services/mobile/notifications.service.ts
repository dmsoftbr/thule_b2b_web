import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { MobileNotificationModel } from "@/models/mobile/notification.model";

export class MobileNotificationsService {
  private static basePath: string = "mobile/notifications";

  static async getAll(): Promise<MobileNotificationModel[]> {
    const response = await api.get<MobileNotificationModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  static async getById(id: string): Promise<MobileNotificationModel> {
    const response = await api.get<MobileNotificationModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<MobileNotificationModel>> {
    const response = await api.post<
      PagedResponseModel<MobileNotificationModel>
    >(`/${this.basePath}/list-paged`, request);
    return response.data;
  }

  static async create(
    data: Partial<MobileNotificationModel>
  ): Promise<MobileNotificationModel> {
    const response = await api.post<MobileNotificationModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<MobileNotificationModel>
  ): Promise<MobileNotificationModel> {
    const response = await api.patch<MobileNotificationModel>(
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
