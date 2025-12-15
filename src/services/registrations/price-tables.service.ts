import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { PriceTableModel } from "@/models/registrations/price-table.model";

export class PriceTablesService {
  private static basePath: string = "registrations/price-tables";

  static async getAll(): Promise<PriceTableModel[]> {
    const response = await api.get<PriceTableModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<PriceTableModel> {
    const response = await api.get<PriceTableModel>(
      `/${this.basePath}/id/${id}`
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<PriceTableModel>> {
    const response = await api.post<PagedResponseModel<PriceTableModel>>(
      `/${this.basePath}/list-paged`,
      request
    );
    return response.data;
  }

  static async create(
    data: Partial<PriceTableModel>
  ): Promise<PriceTableModel> {
    const response = await api.post<PriceTableModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<PriceTableModel>
  ): Promise<PriceTableModel> {
    const response = await api.patch<PriceTableModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
