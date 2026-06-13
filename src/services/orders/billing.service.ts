import { api } from "@/lib/api";
import type { NotaFiscal } from "@/models/orders/nota-fiscal-model";

export type DanfeTipo = "DANFE" | "XML" | "BOLETO";

export class BillingService {
  private static basePath: string = "billing";

  static async listNotas(orderId: string): Promise<NotaFiscal[]> {
    const { data } = await api.get<NotaFiscal[]>(
      `/${this.basePath}/notas/${encodeURIComponent(orderId)}`
    );
    return data;
  }

  // O Datasul gera o arquivo em pasta_danfe; a API devolve a URL (DanfeBaseUrl + nome).
  // Abrimos a URL em nova aba. `skipped` = sem boleto p/ a condição de pagamento.
  static async openDocument(
    tipo: DanfeTipo,
    nota: NotaFiscal
  ): Promise<{ skipped?: boolean; message?: string }> {
    const { data } = await api.get<{
      url?: string;
      pular?: boolean;
      message?: string;
    }>(`/${this.basePath}/danfe`, {
      params: {
        tipo,
        estabel: nota.estabel,
        serie: nota.serie,
        nota: nota.notaFiscal,
      },
    });

    if (data?.pular) return { skipped: true, message: data.message };
    if (data?.url) {
      window.open(data.url, "_blank");
      return {};
    }
    return { skipped: true, message: data?.message ?? "Documento indisponível." };
  }
}
