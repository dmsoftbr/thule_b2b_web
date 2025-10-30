import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ApprovalLevelLimitModel } from "@/models/registrations/approval-level-limit.model";

export class ApprovalLevelLimitsService {
  private static basePath: string = "registrations/approval-level-limits";

  static async getAll(): Promise<ApprovalLevelLimitModel[]> {
    const response = await api.get<ApprovalLevelLimitModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  static async getById(id: string): Promise<ApprovalLevelLimitModel> {
    const response = await api.get<ApprovalLevelLimitModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<ApprovalLevelLimitModel>> {
    const response = await api.post<
      PagedResponseModel<ApprovalLevelLimitModel>
    >(`/${this.basePath}/list-paged`, request);
    return response.data;
  }

  static async create(
    data: Partial<ApprovalLevelLimitModel>
  ): Promise<ApprovalLevelLimitModel> {
    const response = await api.post<ApprovalLevelLimitModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<ApprovalLevelLimitModel>
  ): Promise<ApprovalLevelLimitModel> {
    const response = await api.patch<ApprovalLevelLimitModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
