import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { OrderModel } from "@/models/orders/order-model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./-components/columns";
import { ApprovalsService } from "@/services/orders/approvals.service";
import { api, handleError } from "@/lib/api";
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
import { SearchCombo } from "@/components/ui/search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { add } from "date-fns";

export const Route = createFileRoute("/_app/approvals/")({
  component: ApprovalsPageComponent,
  pendingComponent: TableSkeleton,
});

const searchFieldsList: ServerTableSearchField[] = [
  { id: "orderId", label: "Pedido" },
  { id: "customerAbbreviation", label: "Abrev. Cliente" },
  { id: "customerId", label: "Cód. Cliente" },
  { id: "representativeId", label: "Cód. Representante" },
  { id: "RepresentativeAbbreviation", label: "Abrev. Representante" },
  { id: "CustomerDocumentNumber", label: "CPF/CNPJ Cliente" },
  { id: "CustomerName", label: "Razão Social Cliente" },
];

type BatchAction = "approve" | "reject";

function ApprovalsPageComponent() {
  const navigate = useNavigate();
  const [tableToken, setTableToken] = useState(new Date().valueOf());

  // Filtros (espelham a tela de Pedidos; situação é fixa = pendente no backend).
  const [createdAtFrom, setCreatedAtFrom] = useState<Date | undefined>(
    new Date(add(new Date(), { days: -30 }))
  );
  const [createdAtTo, setCreatedAtTo] = useState<Date | undefined>(new Date());
  const [selectedReps, setSelectedReps] = useState<number[]>([]);

  // Seleção (por id) e linhas da página atual (para o "selecionar todas").
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [currentRows, setCurrentRows] = useState<OrderModel[]>([]);

  // Ação em lote + motivo.
  const [action, setAction] = useState<BatchAction | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: async () => {
      const { data } = await api.get("/registrations/representatives/all");
      return data;
    },
  });

  const refresh = () => {
    setSelected(new Set());
    setTableToken(new Date().valueOf());
  };

  const handleView = (order: OrderModel) => {
    // `from`: o botão Voltar da tela de visualização retorna para Aprovações.
    navigate({
      to: "/orders/view/$orderId",
      params: { orderId: order.id },
      search: { from: "/approvals" },
    });
  };

  const toggleSelect = (orderId: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(orderId);
      else next.delete(orderId);
      return next;
    });
  };

  const allSelected =
    currentRows.length > 0 && currentRows.every((r) => selected.has(r.id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      currentRows.forEach((r) => (checked ? next.add(r.id) : next.delete(r.id)));
      return next;
    });
  };

  const openAction = (a: BatchAction) => {
    setReason("");
    setAction(a);
  };

  const handleConfirm = async () => {
    const ids = [...selected];
    if (ids.length === 0 || !action) return;
    try {
      setIsSubmitting(true);
      const result =
        action === "approve"
          ? await ApprovalsService.approve(ids, reason.trim())
          : await ApprovalsService.reject(ids, reason.trim());

      const verb = action === "approve" ? "aprovado(s)" : "reprovado(s)";
      if (result.success) {
        toast.success(`${result.sucessos} pedido(s) ${verb}.`);
      } else {
        toast.warning(
          `${result.sucessos}/${result.total} ${verb}. ${result.erros.join(" ")}`
        );
      }
      setAction(null);
      refresh();
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAdvancedFilter = () => (
    <div className="mt-2 flex flex-wrap items-end gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="form-group">
        <Label>Período de Inclusão</Label>
        <div className="flex items-center gap-x-2">
          <DatePicker
            defaultValue={createdAtFrom}
            onValueChange={(date) => setCreatedAtFrom(date)}
          />
          <span className="text-sm text-neutral-500">a</span>
          <DatePicker
            defaultValue={createdAtTo}
            onValueChange={(date) => setCreatedAtTo(date)}
          />
        </div>
      </div>
      <div className="form-group flex-1 min-w-[200px]">
        <Label>Representante</Label>
        <SearchCombo
          multipleSelect
          onChange={() => {}}
          onSelectOption={(values) =>
            setSelectedReps(values.map((item) => Number(item.value)))
          }
          staticItems={convertArrayToSearchComboItem(
            representativesData ?? [],
            "id",
            "abbreviation"
          )}
          showSelectButtons
        />
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
    <AppPageHeader titleSlot={"Aprovações"}>
      <div className="space-y-2 p-2">
        <ServerTable<OrderModel>
          key={tableToken}
          defaultSearchField="orderId"
          defaultSortFieldDataIndex="createdAt"
          defaultSortDesc
          searchFields={searchFieldsList}
          columns={columns({
            selectedIds: selected,
            onToggle: toggleSelect,
            fnView: handleView,
            allSelected,
            someSelected,
            hasRows: currentRows.length > 0,
            onToggleAll: toggleSelectAll,
          })}
          showAddButton={false}
          dataUrl="/approvals/list-paged"
          tableClassNames="min-w-[1000px]"
          advancedFilterSlot={renderAdvancedFilter()}
          showAdvancedFilter
          onAfterGetData={(rows) => setCurrentRows(rows ?? [])}
          additionalInfo={{
            representativeIds: selectedReps,
            createdAtFrom:
              createdAtFrom ?? new Date(add(new Date(), { days: -30 })),
            createdAtTo: createdAtTo ?? new Date(),
          }}
        />
      </div>

      {/* Toolbar flutuante no rodapé — só aparece com itens selecionados */}
      {selectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-lg">
            <span className="text-sm font-medium text-neutral-800">
              {selectedCount} selecionado(s)
            </span>
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => openAction("approve")}
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => openAction("reject")}
            >
              Reprovar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelected(new Set())}
            >
              Limpar
            </Button>
          </div>
        </div>
      )}

      {/* Diálogo de motivo (aprovar/reprovar) */}
      <Dialog
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Aprovar" : "Reprovar"} {selectedCount}{" "}
              pedido(s)
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da {action === "approve" ? "aprovação" : "reprovação"}.
              Ele fica registrado no histórico de cada pedido.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 2000))}
            placeholder="Motivo"
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
                action === "approve"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : undefined
              }
              onClick={handleConfirm}
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting
                ? "Processando..."
                : action === "approve"
                  ? "Aprovar"
                  : "Reprovar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppPageHeader>
  );
}
