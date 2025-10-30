import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ApprovalLevelModel } from "@/models/registrations/approval-level.model";

export class ApprovalLevelsService {
  private static basePath: string = "registrations/approval-levels";

  static async getAll(): Promise<ApprovalLevelModel[]> {
    const response = await api.get<ApprovalLevelModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  static async getById(id: string): Promise<ApprovalLevelModel> {
    const response = await api.get<ApprovalLevelModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<ApprovalLevelModel>> {
    const response = await api.post<PagedResponseModel<ApprovalLevelModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  static async create(
    data: Partial<ApprovalLevelModel>
  ): Promise<ApprovalLevelModel> {
    const response = await api.post<ApprovalLevelModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<ApprovalLevelModel>
  ): Promise<ApprovalLevelModel> {
    const response = await api.patch<ApprovalLevelModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
