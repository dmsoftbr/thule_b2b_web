import { api } from "@/lib/api";

export type BatchApprovalResult = {
  success: boolean;
  total: number;
  sucessos: number;
  erros: string[];
};

export class ApprovalsService {
  private static basePath: string = "approvals";

  // Aprova em lote os pedidos selecionados; o motivo é registrado no histórico.
  static async approve(
    orderIds: string[],
    reason: string
  ): Promise<BatchApprovalResult> {
    const { data } = await api.post<BatchApprovalResult>(
      `/${this.basePath}/approve`,
      { orderIds, reason }
    );
    return data;
  }

  // Reprova em lote os pedidos selecionados; o motivo é registrado no histórico.
  static async reject(
    orderIds: string[],
    reason: string
  ): Promise<BatchApprovalResult> {
    const { data } = await api.post<BatchApprovalResult>(
      `/${this.basePath}/reject`,
      { orderIds, reason }
    );
    return data;
  }
}
