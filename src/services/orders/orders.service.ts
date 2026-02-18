import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { OrderModel } from "@/models/orders/order-model";

export class OrdersService {
  private static basePath: string = "orders";

  static async getAll(): Promise<OrderModel[]> {
    const response = await api.get<OrderModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<OrderModel> {
    const response = await api.get<OrderModel>(`/${this.basePath}/id/${id}`);
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<OrderModel>> {
    const response = await api.post<PagedResponseModel<OrderModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }

  static async create(data: Partial<OrderModel>): Promise<OrderModel> {
    const response = await api.post<OrderModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<OrderModel>,
  ): Promise<OrderModel> {
    const response = await api.patch<OrderModel>(
      `/${this.basePath}/${id}`,
      data,
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }

  static async duplicate(id: string) {
    const response = await api.get(`/${this.basePath}/duplicate/${id}`);
    return response.data;
  }
}
