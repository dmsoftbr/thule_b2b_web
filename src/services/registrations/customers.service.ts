import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { CustomerModel } from "@/models/registrations/customer.model";

export class CustomersService {
  private static basePath: string = "registrations/customers";

  static async getAll(): Promise<CustomerModel[]> {
    const response = await api.get<CustomerModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: number): Promise<CustomerModel> {
    const response = await api.get<CustomerModel>(`/${this.basePath}/${id}`);
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<CustomerModel>> {
    const response = await api.post<PagedResponseModel<CustomerModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  static async create(data: Partial<CustomerModel>): Promise<CustomerModel> {
    const response = await api.post<CustomerModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    id: number,
    data: Partial<CustomerModel>
  ): Promise<CustomerModel> {
    const response = await api.patch<CustomerModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
