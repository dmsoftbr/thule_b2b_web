import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { ProductModel } from "@/models/product.model";

export interface ProductImageModel {
  seq: number;
  isMain: boolean;
  thumbUrl: string;
  originalUrl: string;
}

export class ProductsService {
  private static basePath: string = "registrations/products";

  static async getAll(): Promise<ProductModel[]> {
    const response = await api.get<ProductModel[]>(`/${this.basePath}/all`);
    return response.data;
  }

  static async getById(id: string): Promise<ProductModel> {
    const response = await api.get<ProductModel>(
      `/${this.basePath}/id/${encodeURIComponent(id)}`,
    );
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
    await api.delete(`/${this.basePath}/${encodeURIComponent(id)}`);
  }

  // ---- Fotos do produto (galeria) ----

  static async getImages(productId: string): Promise<ProductImageModel[]> {
    const response = await api.get<ProductImageModel[]>(
      `/${this.basePath}/${encodeURIComponent(productId)}/images`,
    );
    return response.data;
  }

  static async uploadImage(
    productId: string,
    file: File,
  ): Promise<ProductImageModel> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ProductImageModel>(
      `/${this.basePath}/${encodeURIComponent(productId)}/images`,
      formData,
    );
    return response.data;
  }

  static async setMainImage(productId: string, seq: number): Promise<void> {
    await api.patch(
      `/${this.basePath}/${encodeURIComponent(productId)}/images/${seq}/main`,
    );
  }

  static async deleteImage(productId: string, seq: number): Promise<void> {
    await api.delete(
      `/${this.basePath}/${encodeURIComponent(productId)}/images/${seq}`,
    );
  }
}
