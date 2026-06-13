import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { ChevronDownIcon } from "lucide-react";
import { useOrder } from "../-context/order-context";

// Parâmetro de runtime (public/config.js): define se a exportação BAIXA o arquivo
// (false) ou ABRE em nova aba do navegador (true). Editável no deploy sem rebuild.
const APP_CONFIG =
  (window as { __APP_CONFIG__?: Record<string, unknown> }).__APP_CONFIG__ ?? {};
const EXPORT_OPEN_IN_BROWSER = APP_CONFIG.EXPORT_OPEN_IN_BROWSER === true;

export const ExportOrder = () => {
  const { order } = useOrder();

  // Entrega o blob conforme o parâmetro: abre em aba ou força o download.
  const deliverBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    if (EXPORT_OPEN_IN_BROWSER) {
      window.open(url, "_blank");
      // A aba ainda precisa do object URL; revoga após um tempo para liberar memória.
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleGetExcel = async () => {
    const response = await api.get(`/orders/xlsx/${encodeURIComponent(order.id)}`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    deliverBlob(blob, `${order.orderId}.xlsx`);
  };

  const handleGetPdf = async () => {
    const response = await api.get(`/orders/pdf/${encodeURIComponent(order.id)}`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    deliverBlob(blob, `${order.orderId}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Exportar <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleGetExcel()}>
          Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleGetPdf()}>PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
