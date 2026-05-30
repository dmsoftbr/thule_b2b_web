import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/number-utils";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { api, handleError } from "@/lib/api";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronRightIcon, LoaderIcon } from "lucide-react";

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const chartConfig = {
  ano: {
    label: "Ano",
    color: "#59a33a",
  },
} satisfies ChartConfig;

// Paleta usada para diferenciar visualmente cada ano no comparativo.
const ANO_CORES = [
  "#59a33a",
  "#2f6fae",
  "#e0a526",
  "#b4541f",
  "#7d4fa1",
  "#3aa39a",
];

export const Route = createFileRoute("/_app/dashboards/dashboard1")({
  component: RouteComponent,
});

type TotalVendaAno = {
  Ano: string;
  TotalVendaSImp: number;
};

// Comparativo por grupo: além do nome do grupo, cada ano selecionado vira uma
// chave dinâmica (ex.: "2024", "2025") com o total daquele ano no grupo.
type TotalVendaGrupos = {
  Grupo: string;
  [ano: string]: number | string;
};

// Agregação hierárquica por cliente: Ano -> Mês -> Dia, usada para a tabela
// pivot com expandir/recolher por período.
type MesAgg = { total: number; dias: Record<number, number> };
type AnoAgg = { total: number; meses: Record<number, MesAgg> };
type ClientePeriodo = {
  cliente: string;
  total: number;
  anos: Record<number, AnoAgg>;
};

// Coluna folha (a que efetivamente vira uma coluna na tabela), no nível em que
// o período está expandido.
type LeafCol =
  | { kind: "year"; ano: number }
  | { kind: "month"; ano: number; mes: number }
  | { kind: "day"; ano: number; mes: number; dia: number };

type DadosRep = {
  representante: string;
  total: number;
};

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalVendasData, setTotalVendasData] = useState<TotalVendaAno[]>([
    { Ano: `${new Date().getFullYear()}`, TotalVendaSImp: 0 },
  ]);
  const [totalVendasGrupoData, setTotalVendasGrupoData] = useState<
    TotalVendaGrupos[]
  >([]);
  // Anos selecionados no último filtro aplicado — definem quantas séries
  // (barras por ano) os gráficos comparativos devem renderizar.
  const [anosSelecionados, setAnosSelecionados] = useState<number[]>([
    new Date().getFullYear(),
  ]);
  const [dadosClientePeriodo, setDadosClientePeriodo] = useState<
    ClientePeriodo[]
  >([]);
  const [dadosRepres, setDadosRepres] = useState<DadosRep[]>([]);
  // Períodos expandidos na tabela pivot. Ano expandido revela seus meses;
  // "ano-mes" expandido revela os dias daquele mês.
  const [anosExpandidos, setAnosExpandidos] = useState<Set<number>>(new Set());
  const [mesesExpandidos, setMesesExpandidos] = useState<Set<string>>(
    new Set(),
  );

  const toggleAno = (ano: number) => {
    setAnosExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(ano)) {
        next.delete(ano);
        // Ao recolher o ano, recolhe também os meses dele.
        setMesesExpandidos((prevMeses) => {
          const nextMeses = new Set(prevMeses);
          for (const key of prevMeses) {
            if (key.startsWith(`${ano}-`)) nextMeses.delete(key);
          }
          return nextMeses;
        });
      } else {
        next.add(ano);
      }
      return next;
    });
  };

  const toggleMes = (ano: number, mes: number) => {
    const key = `${ano}-${mes}`;
    setMesesExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  function formatMillions(value: number) {
    return `${value / 1_000_000} Mi`;
  }

  function formatMil(value: number) {
    return `${formatNumber(value / 1_000, 0)} Mil`;
  }

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data: rawData } = await api.post(
        `/dashboards-thule/dashboard1`,
        filtro,
      );

      // Aplica o filtro "do dia até o dia" (dia do mês) sobre os dados, para
      // garantir o recorte mesmo que o backend não trate esse parâmetro.
      const diaIni = filtro.diaInicial ?? 1;
      const diaFim = filtro.diaFinal ?? 31;
      const data = (rawData as any[]).filter((item) => {
        const dia = new Date(item.data).getDate();
        return dia >= diaIni && dia <= diaFim;
      });

      // Sempre do ano mais velho para o mais novo.
      const anos = (
        filtro.anos && filtro.anos.length > 0
          ? [...filtro.anos]
          : [new Date().getFullYear()]
      ).sort((a, b) => a - b);
      setAnosSelecionados(anos);
      // Por padrão a tabela vem totalmente recolhida: mostra só a coluna de
      // total por ano. O usuário expande ano -> meses -> dias conforme quiser.
      setAnosExpandidos(new Set());
      setMesesExpandidos(new Set());

      // Comparativo por ano: uma barra para cada ano selecionado no filtro.
      setTotalVendasData(agruparPorAno(data, anos));

      // Comparativo por grupo: barras agrupadas, uma por ano em cada grupo.
      setTotalVendasGrupoData(agruparPorGrupoEAno(data, anos));
      setDadosClientePeriodo(
        agruparPorClientePeriodo(data).sort((a, b) => b.total - a.total),
      );
      setDadosRepres(
        agruparPorRepresentante(data).sort((a, b) => b.total - a.total),
      );
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupa o total de vendas por ano (extraído da data de cada registro).
  // Garante uma barra por ano selecionado, mesmo que o total seja zero, para
  // que o comparativo sempre mostre todos os anos escolhidos no filtro.
  function agruparPorAno(data: any[], anos: number[]): TotalVendaAno[] {
    const mapa: Record<number, number> = {};
    data.forEach((item) => {
      const ano = new Date(item.data).getFullYear();
      mapa[ano] = (mapa[ano] ?? 0) + Number(item.totalVendaSimp);
    });

    const anosBase =
      anos && anos.length > 0 ? anos : [new Date().getFullYear()];

    return anosBase
      .map((ano) => ({
        Ano: String(ano),
        TotalVendaSImp: mapa[ano] ?? 0,
      }))
      .sort((a, b) => Number(a.Ano) - Number(b.Ano));
  }

  // Agrupa o total de vendas por grupo (categoria de produto) e por ano,
  // produzindo, para cada grupo, uma chave por ano selecionado. Mantém uma
  // barra por ano em cada grupo, mesmo quando o ano não tem vendas naquele
  // grupo (valor 0), e ordena os grupos pelo total somado dos anos.
  function agruparPorGrupoEAno(
    data: any[],
    anos: number[],
  ): TotalVendaGrupos[] {
    const mapa: Record<string, Record<number, number>> = {};

    data.forEach((item) => {
      const grupo = `${item.categoriaProduto} - ${item.descrCategoriaProduto}`;
      const ano = new Date(item.data).getFullYear();
      if (!mapa[grupo]) mapa[grupo] = {};
      mapa[grupo][ano] = (mapa[grupo][ano] ?? 0) + Number(item.totalVendaSimp);
    });

    const anosBase =
      anos && anos.length > 0 ? anos : [new Date().getFullYear()];

    return Object.entries(mapa)
      .map(([grupo, porAno]) => {
        const row: TotalVendaGrupos = { Grupo: grupo };
        anosBase.forEach((ano) => {
          row[String(ano)] = porAno[ano] ?? 0;
        });
        return row;
      })
      .sort((a, b) => {
        const totalA = anosBase.reduce(
          (acc, ano) => acc + (Number(a[String(ano)]) || 0),
          0,
        );
        const totalB = anosBase.reduce(
          (acc, ano) => acc + (Number(b[String(ano)]) || 0),
          0,
        );
        return totalB - totalA;
      });
  }

  // Agrega vendas por cliente em Ano -> Mês -> Dia, somando o total em cada
  // nível para alimentar a tabela pivot expansível.
  function agruparPorClientePeriodo(data: any[]): ClientePeriodo[] {
    const mapa: Record<string, ClientePeriodo> = {};

    data.forEach((item) => {
      const cliente = item.nomeAbrev;
      const d = new Date(item.data);
      const ano = d.getFullYear();
      const mes = d.getMonth() + 1; // 1 a 12
      const dia = d.getDate();
      const valor = Number(item.totalVendaSimp);

      if (!mapa[cliente]) {
        mapa[cliente] = { cliente, total: 0, anos: {} };
      }
      const c = mapa[cliente];
      c.total += valor;

      if (!c.anos[ano]) c.anos[ano] = { total: 0, meses: {} };
      const a = c.anos[ano];
      a.total += valor;

      if (!a.meses[mes]) a.meses[mes] = { total: 0, dias: {} };
      const m = a.meses[mes];
      m.total += valor;
      m.dias[dia] = (m.dias[dia] ?? 0) + valor;
    });

    return Object.values(mapa);
  }

  function agruparPorRepresentante(data: any[]): DadosRep[] {
    const mapa: Record<string, number> = {};

    data.forEach((item) => {
      const rep = item.representante;

      if (!mapa[rep]) {
        mapa[rep] = 0;
      }

      mapa[rep] += item.totalVendaSimp;
    });

    return Object.entries(mapa).map(([representante, total]) => ({
      representante,
      total,
    }));
  }

  // Dias (1..31) que possuem dados em algum cliente para um dado ano/mês.
  // Evita renderizar colunas de dias vazias quando o mês é expandido.
  const getDiasComDados = (ano: number, mes: number): number[] => {
    const set = new Set<number>();
    dadosClientePeriodo.forEach((c) => {
      const dias = c.anos[ano]?.meses[mes]?.dias;
      if (dias) {
        Object.keys(dias).forEach((d) => set.add(Number(d)));
      }
    });
    return [...set].sort((a, b) => a - b);
  };

  // Monta a lista de colunas-folha conforme o nível de expansão de cada
  // período. Anos vêm do filtro aplicado; meses/dias surgem ao expandir.
  const leafCols = useMemo<LeafCol[]>(() => {
    const anos = [...anosSelecionados].sort((a, b) => a - b);
    const cols: LeafCol[] = [];
    anos.forEach((ano) => {
      if (!anosExpandidos.has(ano)) {
        cols.push({ kind: "year", ano });
        return;
      }
      for (let mes = 1; mes <= 12; mes++) {
        const key = `${ano}-${mes}`;
        if (!mesesExpandidos.has(key)) {
          cols.push({ kind: "month", ano, mes });
          continue;
        }
        const dias = getDiasComDados(ano, mes);
        if (dias.length === 0) {
          cols.push({ kind: "month", ano, mes });
          continue;
        }
        dias.forEach((dia) => cols.push({ kind: "day", ano, mes, dia }));
      }
    });
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anosSelecionados, anosExpandidos, mesesExpandidos, dadosClientePeriodo]);

  const leafValue = (c: ClientePeriodo, col: LeafCol): number => {
    if (col.kind === "year") return c.anos[col.ano]?.total ?? 0;
    if (col.kind === "month")
      return c.anos[col.ano]?.meses[col.mes]?.total ?? 0;
    return c.anos[col.ano]?.meses[col.mes]?.dias[col.dia] ?? 0;
  };

  const leafKey = (col: LeafCol): string =>
    col.kind === "year"
      ? `y${col.ano}`
      : col.kind === "month"
        ? `m${col.ano}-${col.mes}`
        : `d${col.ano}-${col.mes}-${col.dia}`;

  // Total da coluna-folha (rodapé), somando todos os clientes.
  const leafTotal = (col: LeafCol): number =>
    dadosClientePeriodo.reduce((acc, c) => acc + leafValue(c, col), 0);

  // Agrupa as colunas-folha por ano (cabeçalho de 1º nível).
  const anoGroups = useMemo(() => {
    const groups: { ano: number; leaves: LeafCol[] }[] = [];
    leafCols.forEach((col) => {
      const last = groups[groups.length - 1];
      if (last && last.ano === col.ano) last.leaves.push(col);
      else groups.push({ ano: col.ano, leaves: [col] });
    });
    return groups;
  }, [leafCols]);

  // Agrupa colunas (de um ano expandido) por mês (cabeçalho de 2º nível).
  const groupByMes = (leaves: LeafCol[]) => {
    const groups: { mes: number; leaves: LeafCol[] }[] = [];
    leaves.forEach((col) => {
      if (col.kind === "year") return;
      const last = groups[groups.length - 1];
      if (last && last.mes === col.mes) last.leaves.push(col);
      else groups.push({ mes: col.mes, leaves: [col] });
    });
    return groups;
  };

  const grandTotalClientes = dadosClientePeriodo.reduce(
    (acc, c) => acc + c.total,
    0,
  );

  return (
    <AppPageHeader titleSlot="Dashboard de Vendas no Período">
      <div className="flex flex-col w-full p-2 bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-900/30 z-40 flex items-center justify-center">
            <div className="w-[200px] h-20 rounded-lg bg-white z-50 flex items-center justify-center">
              <span>
                <LoaderIcon className="size-4 mr-2 animate-spin text-blue-600" />
              </span>{" "}
              Aguarde...
            </div>
          </div>
        )}
        <DashboardsFilter onAplicar={(filtro) => handleGetData(filtro)} />
        <div className="grid grid-cols-3 gap-x-4 w-full">
          {/* Grafico de Vendas Total */}
          <div className="w-full h-[300px] bg-white pt-4 pb-4">
            <p>Total Vendas</p>
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={totalVendasData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeWidth={0.5} stroke="#444" />
                  <XAxis
                    dataKey="Ano"
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "Ano",
                      position: "insideBottom",
                      offset: -2,
                      fill: "#ccc",
                    }}
                  />
                  <YAxis
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatMillions(value)}
                    label={{
                      value: "TotalVendaSimp",
                      angle: -90,
                      offset: -5,
                      position: "insideLeft",
                      fill: "#ccc",
                      style: { textAnchor: "middle" },
                    }}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="TotalVendaSImp"
                    radius={8}
                    maxBarSize={100}
                  >
                    {totalVendasData.map((item, index) => (
                      <Cell
                        key={item.Ano}
                        fill={ANO_CORES[index % ANO_CORES.length]}
                      />
                    ))}
                    <LabelList
                      dataKey="TotalVendaSImp"
                      position="inside"
                      angle={-90}
                      fill="#ffffff"
                      formatter={(value: number) => formatMil(value)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Grafico de Vendas por Grupo */}
          <div className="w-full h-[300px] bg-white pt-4 pb-4 col-span-2">
            <p>Total Vendas por Grupo</p>
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={totalVendasGrupoData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeWidth={0.5} stroke="#444" />
                  <XAxis
                    dataKey="Grupo"
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatMillions(value)}
                    label={{
                      value: "TotalVendaSimp",
                      angle: -90,
                      offset: -5,
                      position: "insideLeft",
                      fill: "#ccc",
                      style: { textAnchor: "middle" },
                    }}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={24}
                    wrapperStyle={{ paddingTop: 8 }}
                  />
                  {/* Uma série (barra) por ano selecionado, agrupadas por grupo. */}
                  {anosSelecionados.map((ano, index) => (
                    <Bar
                      key={ano}
                      dataKey={String(ano)}
                      name={String(ano)}
                      fill={ANO_CORES[index % ANO_CORES.length]}
                      radius={4}
                      maxBarSize={60}
                    >
                      <LabelList
                        dataKey={String(ano)}
                        position="top"
                        fill="#000"
                        fontSize={9}
                        formatter={(value: number) => formatMil(value)}
                        offset={4}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-4">
          <div className="col-span-3 w-full min-w-0 overflow-auto bg-white max-h-[260px]">
            <table className="w-full min-w-max border-collapse text-xs">
              <thead className="sticky top-0 z-20">
                {/* Linha 1 — Anos (clique para expandir/recolher os meses) */}
                <tr className="bg-neutral-100">
                  <th
                    rowSpan={3}
                    className="sticky left-0 z-30 bg-neutral-100 border font-semibold p-1 text-left min-w-[140px]"
                  >
                    Cliente
                  </th>
                  {anoGroups.map((g) => {
                    const aberto = anosExpandidos.has(g.ano);
                    return (
                      <th
                        key={`ano-${g.ano}`}
                        colSpan={g.leaves.length}
                        className="border font-semibold p-1"
                      >
                        <button
                          type="button"
                          onClick={() => toggleAno(g.ano)}
                          className="inline-flex items-center gap-1 hover:text-blue-700 cursor-pointer"
                          title={aberto ? "Recolher meses" : "Expandir meses"}
                        >
                          {aberto ? (
                            <ChevronDownIcon className="size-3" />
                          ) : (
                            <ChevronRightIcon className="size-3" />
                          )}
                          {g.ano}
                        </button>
                      </th>
                    );
                  })}
                  <th
                    rowSpan={3}
                    className="border font-semibold p-1 w-[80px]"
                  >
                    Total
                  </th>
                </tr>
                {/* Linha 2 — Meses (clique para expandir/recolher os dias) */}
                <tr className="bg-neutral-50">
                  {anoGroups.map((g) => {
                    if (!anosExpandidos.has(g.ano)) {
                      return (
                        <th
                          key={`mh-${g.ano}`}
                          className="border p-1 text-neutral-400 font-normal"
                        >
                          —
                        </th>
                      );
                    }
                    return groupByMes(g.leaves).map((mg) => {
                      const key = `${g.ano}-${mg.mes}`;
                      const aberto = mesesExpandidos.has(key);
                      const temDias = getDiasComDados(g.ano, mg.mes).length > 0;
                      return (
                        <th
                          key={`mes-${key}`}
                          colSpan={mg.leaves.length}
                          className="border font-semibold p-1"
                        >
                          <button
                            type="button"
                            onClick={() => toggleMes(g.ano, mg.mes)}
                            disabled={!temDias}
                            className="inline-flex items-center gap-1 hover:text-blue-700 cursor-pointer disabled:cursor-default disabled:hover:text-inherit"
                            title={
                              !temDias
                                ? "Sem movimento no mês"
                                : aberto
                                  ? "Recolher dias"
                                  : "Expandir dias"
                            }
                          >
                            {temDias &&
                              (aberto ? (
                                <ChevronDownIcon className="size-3" />
                              ) : (
                                <ChevronRightIcon className="size-3" />
                              ))}
                            {MESES_ABREV[mg.mes - 1]}
                          </button>
                        </th>
                      );
                    });
                  })}
                </tr>
                {/* Linha 3 — Dias */}
                <tr className="bg-neutral-50">
                  {leafCols.map((col) => (
                    <th
                      key={`dia-${leafKey(col)}`}
                      className="border p-1 font-semibold text-neutral-600"
                    >
                      {col.kind === "day" ? col.dia : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dadosClientePeriodo.length === 0 && (
                  <tr>
                    <td
                      colSpan={leafCols.length + 2}
                      className="border p-2 text-center text-neutral-500"
                    >
                      Sem dados para exibir
                    </td>
                  </tr>
                )}
                {dadosClientePeriodo.map((c) => (
                  <tr key={c.cliente} className="odd:bg-neutral-50">
                    <td className="sticky left-0 z-10 bg-inherit border p-1 font-normal min-w-[140px]">
                      {c.cliente}
                    </td>
                    {leafCols.map((col) => (
                      <td
                        key={`${c.cliente}-${leafKey(col)}`}
                        className="border p-1 text-right font-normal whitespace-nowrap"
                      >
                        {formatNumber(leafValue(c, col), 0)}
                      </td>
                    ))}
                    <td className="border p-1 text-right font-semibold whitespace-nowrap">
                      {formatNumber(c.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 z-20">
                <tr className="bg-neutral-100">
                  <th className="sticky left-0 z-30 bg-neutral-100 border p-1 text-right font-semibold">
                    Total
                  </th>
                  {leafCols.map((col) => (
                    <th
                      key={`tot-${leafKey(col)}`}
                      className="border p-1 text-right font-semibold whitespace-nowrap"
                    >
                      {formatNumber(leafTotal(col), 0)}
                    </th>
                  ))}
                  <th className="border p-1 text-right font-semibold whitespace-nowrap">
                    {formatNumber(grandTotalClientes, 0)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="min-w-0 max-w-[250px] ml-6">
            {/* Resumo por Rep */}
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-neutral-100 flex">
                  <th className="border font-semibold text-xs p-1 flex-1">
                    Representante
                  </th>
                  <th className="border font-semibold text-xs p-1 w-[100px]">
                    TotalVendaSImp
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: 200 }}
              >
                {dadosRepres.map((rep, index) => (
                  <tr
                    key={index}
                    className="flex w-full border-b last:border-b-0 border-l"
                  >
                    <td className="border-r text-xs p-1 flex-1">
                      {rep.representante}
                    </td>
                    <td className="text-xs p-1 text-right w-[100px]">
                      {formatNumber(rep.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="border font-semibold text-xs p-1 flex-1">
                    Total
                  </th>
                  <th className="border font-semibold text-xs p-1 text-right w-[100px]">
                    {formatNumber(
                      dadosRepres.reduce((acc, b) => acc + b.total, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </AppPageHeader>
  );
}
