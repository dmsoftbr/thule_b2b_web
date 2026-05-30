import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { PriceExceptionTableModel } from "@/models/registrations/price-exception-table.model";
import type { TreeNode } from "@/components/tree-checkbox/tree-checkbox";

// Um nó configurado da árvore de exceção: caminho + margem + estabelecimentos.
export interface PriceExceptionRulePayload {
  selectionPath: string;
  marginPercent: number;
  branchIds: string[];
}

export interface SavePriceExceptionGridRequest {
  exceptionTableId: string;
  rules: PriceExceptionRulePayload[];
}

export class PriceExceptionTablesService {
  private static basePath: string = "registrations/price-exception-tables";

  static async getAll(): Promise<PriceExceptionTableModel[]> {
    const response = await api.get<PriceExceptionTableModel[]>(
      `/${this.basePath}/all`,
    );
    return response.data;
  }

  static async getById(id: string): Promise<PriceExceptionTableModel> {
    const response = await api.get<PriceExceptionTableModel>(
      `/${this.basePath}/id/${encodeURIComponent(id)}`,
    );
    return response.data;
  }

  static async listPaged(
    request: PagedRequestModel,
  ): Promise<PagedResponseModel<PriceExceptionTableModel>> {
    const response = await api.post<PagedResponseModel<PriceExceptionTableModel>>(
      `/${this.basePath}/list-paged`,
      request,
    );
    return response.data;
  }

  static async create(
    data: Partial<PriceExceptionTableModel>,
  ): Promise<PriceExceptionTableModel> {
    const response = await api.post<PriceExceptionTableModel>(
      `/${this.basePath}`,
      data,
    );
    return response.data;
  }

  static async update(
    data: Partial<PriceExceptionTableModel>,
  ): Promise<PriceExceptionTableModel> {
    const response = await api.patch<PriceExceptionTableModel>(
      `/${this.basePath}`,
      data,
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/${this.basePath}/${encodeURIComponent(id)}`);
  }

  // Árvore completa com margem + estabelecimentos embutidos em node.data.
  static async getTree(id: string): Promise<TreeNode[]> {
    const response = await api.get<TreeNode[]>(
      `/${this.basePath}/grid/${encodeURIComponent(id)}`,
    );
    return response.data;
  }

  static async saveGrid(
    id: string,
    rules: PriceExceptionRulePayload[],
  ): Promise<void> {
    const payload: SavePriceExceptionGridRequest = {
      exceptionTableId: id,
      rules,
    };
    await api.post(
      `/${this.basePath}/grid/${encodeURIComponent(id)}`,
      payload,
    );
  }
}
