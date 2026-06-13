import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { toast } from "sonner";
import { formatNumber } from "@/lib/number-utils";
import { formatDate } from "@/lib/datetime-utils";
import { handleError } from "@/lib/api";
import {
  BillingService,
  type DanfeTipo,
} from "@/services/orders/billing.service";
import type { OrderModel } from "@/models/orders/order-model";
import type { NotaFiscal } from "@/models/orders/nota-fiscal-model";
import {
  BarcodeIcon,
  FileCodeIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";

interface Props {
  order: OrderModel | null;
  onClose: () => void;
}

export function BillingModal({ order, onClose }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const notasQuery = useQuery({
    queryKey: ["billing-notas", order?.id],
    queryFn: () => BillingService.listNotas(order!.id),
    enabled: !!order,
  });

  const notas = notasQuery.data ?? [];

  const handleOpen = async (tipo: DanfeTipo, nota: NotaFiscal) => {
    const key = `${tipo}-${nota.notaFiscal}`;
    try {
      setDownloading(key);
      const r = await BillingService.openDocument(tipo, nota);
      if (r.skipped) toast.info(r.message ?? "Documento indisponível.");
    } catch (e) {
      toast.error(handleError(e));
    } finally {
      setDownloading(null);
    }
  };

  const docButton = (
    tipo: DanfeTipo,
    nota: NotaFiscal,
    label: string,
    icon: React.ReactNode
  ) => {
    const key = `${tipo}-${nota.notaFiscal}`;
    return (
      <AppTooltip message={label}>
        <Button
          variant="ghost"
          size="sm"
          disabled={downloading === key}
          onClick={() => handleOpen(tipo, nota)}
        >
          {downloading === key ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            icon
          )}
        </Button>
      </AppTooltip>
    );
  };

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            Faturamento{order?.orderId ? ` — Pedido ${order.orderId}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Estabel.</th>
                <th className="px-2 py-2">Nota Fiscal</th>
                <th className="px-2 py-2">Série</th>
                <th className="px-2 py-2">Emissão</th>
                <th className="px-2 py-2 text-right">Valor Total</th>
                <th className="px-2 py-2">Transportadora</th>
                <th className="px-2 py-2 text-center">Embarque</th>
                <th className="px-2 py-2 text-center">DANFE</th>
                <th className="px-2 py-2 text-center">XML</th>
                <th className="px-2 py-2 text-center">Boleto</th>
              </tr>
            </thead>
            <tbody>
              {notasQuery.isLoading && (
                <tr>
                  <td colSpan={10} className="p-2">
                    <Skeleton className="h-8 w-full" />
                  </td>
                </tr>
              )}
              {!notasQuery.isLoading && notas.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="p-6 text-center text-muted-foreground"
                  >
                    Nenhuma nota fiscal emitida para este pedido.
                  </td>
                </tr>
              )}
              {notas.map((n, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="px-2 py-1.5">{n.estabel}</td>
                  <td className="px-2 py-1.5 font-medium">{n.notaFiscal}</td>
                  <td className="px-2 py-1.5">{n.serie}</td>
                  <td className="px-2 py-1.5">{formatDate(n.emissao)}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">
                    {formatNumber(n.valorTotal, 2)}
                  </td>
                  <td className="px-2 py-1.5">{n.transportadora}</td>
                  <td className="px-2 py-1.5 text-center">
                    {n.embarque || ""}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {docButton(
                      "DANFE",
                      n,
                      "Abrir DANFE (PDF)",
                      <FileTextIcon className="size-4 text-blue-600" />
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {docButton(
                      "XML",
                      n,
                      "Baixar XML",
                      <FileCodeIcon className="size-4 text-emerald-600" />
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {docButton(
                      "BOLETO",
                      n,
                      "Abrir Boleto",
                      <BarcodeIcon className="size-4 text-neutral-700" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
