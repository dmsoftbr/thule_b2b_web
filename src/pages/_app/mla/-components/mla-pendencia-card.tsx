import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/number-utils";
import { formatDate } from "@/lib/datetime-utils";
import { cn } from "@/lib/utils";
import type { MlaPendencia } from "@/models/mla/mla-models";
import { ChevronDownIcon, TablePropertiesIcon } from "lucide-react";

interface Props {
  pendencia: MlaPendencia;
  tipoLabel: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  /** Índice na lista — usado para o efeito zebra. */
  index?: number;
}

export function MlaPendenciaCard({
  pendencia,
  tipoLabel,
  checked,
  onToggle,
  index = 0,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const grade = pendencia.gradeContabil ?? [];
  const gradeTotal = grade.reduce((sum, g) => sum + (g.valor ?? 0), 0);

  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 shadow-sm transition-colors",
        checked
          ? "border-blue-300 border-l-blue-500 bg-blue-50/40 ring-1 ring-blue-300"
          : cn(
              "border-l-neutral-200 hover:border-l-neutral-400",
              // zebra sutil para escanear a lista
              index % 2 === 0 ? "bg-white" : "bg-neutral-50",
            ),
      )}
    >
      {/* Cabeçalho clicável — clicar em qualquer ponto seleciona a pendência */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onToggle(!checked);
          }
        }}
        className="flex cursor-pointer items-start gap-3 p-3"
      >
        <Checkbox
          checked={checked}
          // visual apenas; o clique é tratado pelo container (evita toggle duplo)
          className="pointer-events-none mt-0.5 size-5 border-2 border-neutral-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-blue-700">
                #{pendencia.nrDocumento || pendencia.nrTransacao}
              </span>
              <Badge variant="secondary" className="font-medium">
                {tipoLabel}
              </Badge>
              {pendencia.nrDocumento && (
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
                  Transação {pendencia.nrTransacao}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold tabular-nums text-neutral-900">
                R$ {formatNumber(pendencia.valor, 2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(pendencia.dtGeracao)}
              </div>
            </div>
          </div>

          {/* Meta: solicitante / aprovador / lotação */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <Meta label="Solicitante" value={pendencia.codSolicit} />
            <Sep />
            <Meta label="Aprovador" value={pendencia.codAprovador} />
            {pendencia.lotacaoDoc && (
              <>
                <Sep />
                <Meta label="Lotação" value={pendencia.lotacaoDoc} />
              </>
            )}
          </div>

          {pendencia.detalhe && (
            <div
              className="mt-2 text-sm leading-relaxed [&_*]:!text-inherit"
              // Detalhe vem como HTML do Datasul (conteúdo confiável da intranet).
              dangerouslySetInnerHTML={{ __html: pendencia.detalhe }}
            />
          )}
        </div>
      </div>

      {/* Grade contábil — seção separada (clicar aqui NÃO seleciona) */}
      {grade.length > 0 && (
        <div className="border-t">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100/70"
          >
            <span className="inline-flex items-center gap-2">
              <TablePropertiesIcon className="size-4 text-neutral-500" />
              Grade contábil
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700">
                {grade.length}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              {expanded ? "Ocultar" : "Ver lançamentos"}
              <ChevronDownIcon
                className={cn(
                  "size-4 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </span>
          </button>

          {expanded && (
            <div className="overflow-x-auto px-3 pb-3">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-left text-[11px] uppercase tracking-wide text-neutral-500">
                    <th className="rounded-l px-2 py-1.5 font-semibold">Conta</th>
                    <th className="px-2 py-1.5 font-semibold">C. Custo</th>
                    <th className="px-2 py-1.5 font-semibold">Item</th>
                    <th className="px-2 py-1.5 text-right font-semibold">Qtde</th>
                    <th className="px-2 py-1.5 text-right font-semibold">Valor</th>
                    <th className="rounded-r px-2 py-1.5 font-semibold">
                      Narrativa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grade.map((g, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-100 align-top odd:bg-white even:bg-neutral-50"
                    >
                      <td className="px-2 py-1.5">
                        <span className="font-medium text-neutral-800">
                          {g.conta}
                        </span>
                        {g.descConta ? (
                          <span className="block text-neutral-500">
                            {g.descConta}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-1.5">
                        <span className="text-neutral-800">{g.cCusto}</span>
                        {g.descCC ? (
                          <span className="block text-neutral-500">
                            {g.descCC}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-1.5">{g.itCodigo}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {g.qtde ? formatNumber(g.qtde, 2) : ""}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium tabular-nums text-neutral-900">
                        {formatNumber(g.valor, 2)}
                      </td>
                      <td className="px-2 py-1.5 text-neutral-600">
                        {g.narrativa}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {grade.length > 1 && (
                  <tfoot>
                    <tr className="border-t-2 border-neutral-300 font-semibold">
                      <td className="px-2 py-1.5" colSpan={4}>
                        Total
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {formatNumber(gradeTotal, 2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  return (
    <span>
      <span className="text-neutral-400">{label}:</span>{" "}
      <span className="font-medium text-neutral-600">{value || "—"}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-neutral-300">•</span>;
}
