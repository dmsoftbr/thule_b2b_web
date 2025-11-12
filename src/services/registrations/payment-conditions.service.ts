import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";

export class PaymentConditionsService {
  private static basePath: string = "registrations/payment-conditions";

  static async getAll(): Promise<PaymentConditionModel[]> {
    const response = await api.get<PaymentConditionModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  static async getById(id: number): Promise<PaymentConditionModel> {
    const response = await api.get<PaymentConditionModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<PaymentConditionModel>> {
    const response = await api.post<PagedResponseModel<PaymentConditionModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  static async create(
    data: Partial<PaymentConditionModel>
  ): Promise<PaymentConditionModel> {
    const response = await api.post<PaymentConditionModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  static async update(
    id: number,
    data: Partial<PaymentConditionModel>
  ): Promise<PaymentConditionModel> {
    const response = await api.patch<PaymentConditionModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
