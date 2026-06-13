import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MlaService } from "@/services/mla/mla.service";
import { hasDatasulCreds, getDatasulCreds } from "@/lib/datasul-session";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { ArrowRightLeftIcon } from "lucide-react";
import { handleError } from "@/lib/api";
import type { MlaTipoDocumento } from "@/models/mla/mla-models";
import { DatasulLoginGate } from "./-components/datasul-login-dialog";
import {
  NarrativaDialog,
  type NarrativaAction,
} from "./-components/narrativa-dialog";
import { MlaPendenciaCard } from "./-components/mla-pendencia-card";
import { MlaPendenciaSkeleton } from "./-components/mla-pendencia-skeleton";

export const Route = createFileRoute("/_app/mla/")({
  component: MlaPage,
});

function MlaPage() {
  const [connected, setConnected] = useState(hasDatasulCreds());
  // Distingue "primeiro acesso" (gate aberto sem sessão) de "troca de usuário"
  // (gate aberto a partir de uma sessão já ativa). Muda o comportamento do Voltar.
  const [switching, setSwitching] = useState(false);

  // Filtros aplicados (disparam a query ao clicar em "Buscar").
  const [busca, setBusca] = useState("");
  const [selectedTipos, setSelectedTipos] = useState<number[]>([]);
  const [applied, setApplied] = useState({ busca: "", tipos: [] as number[] });

  // Seleção das pendências para ação em lote.
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Ação de narrativa (aprovar/reprovar) em andamento.
  const [action, setAction] = useState<NarrativaAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiposQuery = useQuery({
    queryKey: ["mla-tipos"],
    queryFn: () => MlaService.listTipos(),
    enabled: connected,
    staleTime: 10 * 60 * 1000,
  });

  const pendenciasQuery = useQuery({
    queryKey: ["mla-pendencias", applied],
    queryFn: () => MlaService.listPendencias(applied.busca, applied.tipos),
    enabled: connected,
  });

  const tipoLabel = useMemo(() => {
    const map = new Map<number, string>();
    (tiposQuery.data ?? []).forEach((t: MlaTipoDocumento) =>
      map.set(t.codTipDoc, t.desTipDoc)
    );
    return (tipoId: number) => map.get(tipoId) ?? `Tipo ${tipoId}`;
  }, [tiposQuery.data]);

  const toggleTipo = (codTipDoc: number, checked: boolean) => {
    setSelectedTipos((prev) =>
      checked ? [...prev, codTipDoc] : prev.filter((t) => t !== codTipDoc)
    );
  };

  const applyFilters = () => {
    setSelected(new Set());
    setApplied({ busca, tipos: selectedTipos });
  };

  const toggleSelect = (nrTransacao: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(nrTransacao);
      else next.delete(nrTransacao);
      return next;
    });
  };

  const handleConfirmAction = async (narrativa: string) => {
    const ids = [...selected];
    if (ids.length === 0) return;
    try {
      setIsSubmitting(true);
      const result =
        action === "aprovar"
          ? await MlaService.aprovar(ids, narrativa)
          : await MlaService.reprovar(ids, narrativa);

      if (result.success) {
        toast.success(
          `${result.sucessos} ${result.sucessos === 1 ? "pendência processada" : "pendências processadas"}.`
        );
      } else {
        toast.warning(
          `${result.sucessos}/${result.total} processadas. ${result.erros.join(" ")}`
        );
      }
      setAction(null);
      setSelected(new Set());
      pendenciasQuery.refetch();
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendencias = pendenciasQuery.data ?? [];
  const selectedCount = selected.size;
  const allSelected =
    pendencias.length > 0 &&
    pendencias.every((p) => selected.has(p.nrTransacao));
  const someSelected = selectedCount > 0 && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelected(
      checked ? new Set(pendencias.map((p) => p.nrTransacao)) : new Set(),
    );
  };

  const datasulUser = getDatasulCreds()?.usuario;

  // Abre o gate em modo "troca": NÃO limpa as credenciais, então o Voltar pode
  // cancelar e retornar à lista com a sessão atual. Conectar com novo usuário
  // sobrescreve as credenciais normalmente.
  const trocarUsuario = () => {
    setSwitching(true);
    setSelected(new Set());
    setConnected(false);
  };

  // Voltar do gate: na troca, cancela e volta à lista (sem deslogar); no primeiro
  // acesso (sem sessão), volta para a tela anterior do navegador.
  const handleCancelLogin = () => {
    if (switching && hasDatasulCreds()) {
      setSwitching(false);
      setConnected(true);
    } else {
      window.history.back();
    }
  };

  const titleSlot = (
    <span className="flex flex-wrap items-center gap-2">
      Aprovações MLA
      {connected && datasulUser && (
        <>
          <span className="font-normal text-neutral-400">—</span>
          <AppTooltip message="Trocar usuário Datasul">
            <button
              type="button"
              onClick={trocarUsuario}
              className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-0.5 font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-800"
            >
              {datasulUser}
              <ArrowRightLeftIcon className="size-4 text-neutral-500" />
            </button>
          </AppTooltip>
        </>
      )}
    </span>
  );

  return (
    <AppPageHeader titleSlot={titleSlot}>
      {!connected ? (
        <DatasulLoginGate
          onConnected={() => {
            setSwitching(false);
            setConnected(true);
          }}
          onCancel={handleCancelLogin}
        />
      ) : (
        <div className="space-y-3 p-2">
          {/* Filtros */}
          <div className="rounded-md border bg-white p-3">
            <div className="mb-2 text-sm font-medium">
              Tipos de documento
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {tiposQuery.isLoading && (
                <Skeleton className="h-5 w-64" />
              )}
              {(tiposQuery.data ?? []).map((t) => (
                <label
                  key={t.codTipDoc}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    className="border-2 border-neutral-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    checked={selectedTipos.includes(t.codTipDoc)}
                    onCheckedChange={(v) => toggleTipo(t.codTipDoc, v === true)}
                  />
                  {t.desTipDoc}
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Buscar (documento, detalhe...)"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="max-w-xs"
              />
              <Button onClick={applyFilters}>Buscar</Button>
            </div>
          </div>

          {/* Barra de seleção fixa no topo (contagem + selecionar todas).
              As AÇÕES ficam na toolbar inferior, que surge ao selecionar. */}
          <div className="sticky top-0 z-10 -mx-2 border-y bg-white/90 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <label className="flex w-fit cursor-pointer select-none items-center gap-2 text-sm">
              <Checkbox
                className="size-5 border-2 border-neutral-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                disabled={pendencias.length === 0}
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={(v) => toggleSelectAll(v === true)}
              />
              <span className="font-semibold text-neutral-800">
                {selectedCount > 0
                  ? `${selectedCount} selecionada(s)`
                  : "Selecionar todas"}
              </span>
              <span className="text-muted-foreground">
                ·{" "}
                {pendenciasQuery.isFetching
                  ? "carregando…"
                  : `${pendencias.length} pendência(s)`}
              </span>
            </label>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {pendenciasQuery.isFetching ? (
              // Skeleton enquanto busca (primeira carga E refetch após filtro/ação).
              Array.from({ length: 5 }).map((_, i) => (
                <MlaPendenciaSkeleton key={i} />
              ))
            ) : pendencias.length === 0 ? (
              <div className="rounded-md border bg-white p-6 text-center text-sm text-muted-foreground">
                Nenhuma pendência encontrada para a sua alçada.
              </div>
            ) : (
              pendencias.map((p, i) => (
                <MlaPendenciaCard
                  key={p.nrTransacao}
                  index={i}
                  pendencia={p}
                  tipoLabel={tipoLabel(p.tipoID)}
                  checked={selected.has(p.nrTransacao)}
                  onToggle={(c) => toggleSelect(p.nrTransacao, c)}
                />
              ))
            )}
          </div>

          {/* Espaçador para o último card não ficar atrás da pill flutuante. */}
          {selectedCount > 0 && <div className="h-20" aria-hidden />}
        </div>
      )}

      {/* Toolbar de ações — pill flutuante no rodapé, surge ao selecionar.
          Fixa no viewport (sempre visível ao rolar a lista). */}
      {connected && selectedCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow-2xl ring-1 ring-black/5">
            <span className="pl-1 text-sm font-semibold text-neutral-800">
              {selectedCount} selecionada(s)
            </span>
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => setSelected(new Set())}
            >
              Limpar
            </button>
            <div className="h-6 w-px bg-neutral-200" />
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setAction("aprovar")}
            >
              Aprovar ({selectedCount})
            </Button>
            <Button variant="destructive" onClick={() => setAction("reprovar")}>
              Reprovar ({selectedCount})
            </Button>
          </div>
        </div>
      )}

      <NarrativaDialog
        action={action}
        count={selectedCount}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmAction}
        onClose={() => setAction(null)}
      />
    </AppPageHeader>
  );
}
