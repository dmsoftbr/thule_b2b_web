import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ProductModel } from "@/models/product.model";

export class ProductsService {
  private static basePath: string = "registrations/products";

  static async getAll(): Promise<ProductModel[]> {
    const response = await api.get<ProductModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<ProductModel> {
    const response = await api.get<ProductModel>(`/${this.basePath}/id/${id}`);
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<ProductModel>> {
    const response = await api.post<PagedResponseModel<ProductModel>>(
      `/${this.basePath}/list`,
      request,
    );
    return response.data;
  }

  static async create(data: Partial<ProductModel>): Promise<ProductModel> {
    const response = await api.post<ProductModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async update(data: Partial<ProductModel>): Promise<ProductModel> {
    const response = await api.patch<ProductModel>(`/${this.basePath}`, data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
