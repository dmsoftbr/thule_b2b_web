import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import { createFileRoute } from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { useState } from "react";
import { columns } from "./-components/columns";
import {
  OrderConfirmationService,
} from "@/services/orders/order-confirmation.service";
import { handleError } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { add } from "date-fns";
import type { OrderConfirmation } from "@/models/orders/order-confirmation-model";

export const Route = createFileRoute("/_app/order-confirmation/")({
  component: OrderConfirmationPageComponent,
  pendingComponent: TableSkeleton,
});

const searchFieldsList: ServerTableSearchField[] = [
  { id: "pedido", label: "Pedido" },
  { id: "clienteNome", label: "Cliente" },
  { id: "item", label: "Item" },
  { id: "representante", label: "Representante" },
];

type ConfirmAction = "confirm" | "reject";

function OrderConfirmationPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());

  const [dtIni, setDtIni] = useState<Date | undefined>(
    new Date(add(new Date(), { days: -90 }))
  );
  const [dtFim, setDtFim] = useState<Date | undefined>(new Date());

  // Guarda a linha inteira (não só o id) — o Datasul precisa de pedido+cliente+seq+item.
  const [selected, setSelected] = useState<Map<string, OrderConfirmation>>(
    new Map()
  );
  const [currentRows, setCurrentRows] = useState<OrderConfirmation[]>([]);

  const [action, setAction] = useState<ConfirmAction | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = () => {
    setSelected(new Map());
    setTableToken(new Date().valueOf());
  };

  const toggleSelect = (row: OrderConfirmation, checked: boolean) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (checked) next.set(row.id, row);
      else next.delete(row.id);
      return next;
    });
  };

  const allSelected =
    currentRows.length > 0 && currentRows.every((r) => selected.has(r.id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Map(prev);
      currentRows.forEach((r) =>
        checked ? next.set(r.id, r) : next.delete(r.id)
      );
      return next;
    });
  };

  const openAction = (a: ConfirmAction) => {
    setReason("");
    setAction(a);
  };

  const handleConfirm = async () => {
    const rows = [...selected.values()];
    if (rows.length === 0 || !action) return;
    try {
      setIsSubmitting(true);
      const result =
        action === "confirm"
          ? await OrderConfirmationService.confirm(rows, reason.trim())
          : await OrderConfirmationService.reject(rows, reason.trim());

      const verb = action === "confirm" ? "confirmado(s)" : "recusado(s)";
      if (result.success) {
        toast.success(`${result.sucessos} item(ns) ${verb}.`);
        setAction(null);
        refresh();
      } else {
        // Backend ainda sem o método de gravação no Datasul: mostra o motivo.
        toast.warning(result.erros.join(" ") || `Não foi possível ${verb}.`);
        setAction(null);
      }
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAdvancedFilter = () => (
    <div className="mt-2 flex flex-wrap items-end gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="form-group">
        <Label>Período de Implantação</Label>
        <div className="flex items-center gap-x-2">
          <DatePicker
            defaultValue={dtIni}
            onValueChange={(date) => setDtIni(date)}
          />
          <span className="text-sm text-neutral-500">a</span>
          <DatePicker
            defaultValue={dtFim}
            onValueChange={(date) => setDtFim(date)}
          />
        </div>
      </div>
      <div className="flex gap-x-2">
        <Button onClick={() => setTableToken(new Date().valueOf())}>
          Aplicar Filtro
        </Button>
      </div>
    </div>
  );

  const selectedCount = selected.size;

  return (
    <AppPageHeader titleSlot="Confirmação de Pedidos">
      <div className="space-y-2 p-2">
        <ServerTable<OrderConfirmation>
          key={tableToken}
          defaultSearchField="pedido"
          defaultSortFieldDataIndex="pedido"
          searchFields={searchFieldsList}
          columns={columns({
            selectedIds: new Set(selected.keys()),
            onToggle: toggleSelect,
            allSelected,
            someSelected,
            hasRows: currentRows.length > 0,
            onToggleAll: toggleSelectAll,
          })}
          showAddButton={false}
          dataUrl="/order-confirmation/list-paged"
          tableClassNames="min-w-[1000px]"
          advancedFilterSlot={renderAdvancedFilter()}
          showAdvancedFilter
          onAfterGetData={(rows) => setCurrentRows(rows ?? [])}
          additionalInfo={{
            dtImplantIni: dtIni ?? new Date(add(new Date(), { days: -90 })),
            dtImplantFim: dtFim ?? new Date(),
          }}
        />
      </div>

      {/* Toolbar flutuante — só aparece com itens selecionados */}
      {selectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-lg">
            <span className="text-sm font-medium text-neutral-800">
              {selectedCount} selecionado(s)
            </span>
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => openAction("confirm")}
            >
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => openAction("reject")}
            >
              Recusar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelected(new Map())}
            >
              Limpar
            </Button>
          </div>
        </div>
      )}

      {/* Diálogo de confirmação/recusa */}
      <Dialog open={!!action} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "confirm" ? "Confirmar" : "Recusar"} {selectedCount}{" "}
              item(ns)
            </DialogTitle>
            <DialogDescription>
              {action === "confirm"
                ? "Confirmar os itens selecionados para faturamento."
                : "Recusar os itens selecionados."}{" "}
              O motivo (opcional) fica registrado.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 2000))}
            placeholder="Motivo (opcional)"
            rows={4}
            maxLength={2000}
          />
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setAction(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant={action === "reject" ? "destructive" : "default"}
              className={
                action === "confirm"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : undefined
              }
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processando..."
                : action === "confirm"
                  ? "Confirmar"
                  : "Recusar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppPageHeader>
  );
}
