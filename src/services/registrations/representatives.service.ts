import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { RepresentativeModel } from "@/models/representative.model";

export class RepresentativesService {
  private basePath: string = "registrations/representatives";

  async getAll(): Promise<RepresentativeModel[]> {
    const response = await api.get<RepresentativeModel[]>(
      `/${this.basePath}/all`
    );
    return response.data;
  }

  async getById(id: number): Promise<RepresentativeModel> {
    const response = await api.get<RepresentativeModel>(
      `/${this.basePath}/${id}`
    );
    return response.data;
  }

  async listPaged(
    request: PagedRequestModel
  ): Promise<PagedResponseModel<RepresentativeModel>> {
    const response = await api.post<PagedResponseModel<RepresentativeModel>>(
      `/${this.basePath}/list`,
      request
    );
    return response.data;
  }

  async create(
    data: Partial<RepresentativeModel>
  ): Promise<RepresentativeModel> {
    const response = await api.post<RepresentativeModel>(
      `/${this.basePath}`,
      data
    );
    return response.data;
  }

  async update(
    id: number,
    data: Partial<RepresentativeModel>
  ): Promise<RepresentativeModel> {
    const response = await api.patch<RepresentativeModel>(
      `/${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/${this.basePath}/${id}`);
  }
}
