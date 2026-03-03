import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { api, handleError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/number-utils";
import type { TipoItem } from "./-components/agrupamento-estoque";

type GeralData = {
  itemCod: string;
  descricao: string;
  qtd: number;
  totalVendaSimp: number;
};

export const Route = createFileRoute("/_app/dashboards/dashboard7")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("geral");
  const [tableData, setTableData] = useState<GeralData[]>([]);
  const [dadosGerais, setDadosGerais] = useState<any[]>([]);
  const [mesData, setMesData] = useState<any[]>([]);

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/dashboards-thule/dashboard1`, filtro);
      setDadosGerais(data);
      setView("geral");
      setTableData(
        agrupaProdutoGeral(data).sort(
          (a, b) => b.totalVendaSimp - a.totalVendaSimp,
        ),
      );
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  function handleSetViewGeral() {
    setView("geral");
    const dados = agrupaProdutoGeral(dadosGerais);
    setTableData(dados);
  }

  function handleSetViewKits() {
    setView("kits");
    const dados = agrupaKits(dadosGerais);
    setTableData(dados);
  }

  function handleSetViewMes() {
    setView("mes");
    const dados = agrupaMes(dadosGerais);
    console.log(dados);
    setMesData(dados);
  }

  function agrupaProdutoGeral(data: any[]) {
    const mapa: Record<string, GeralData> = {};

    data.forEach((item) => {
      const qtd = item.qtd;
      const totalVendaSimp = item.totalVendaSimp;

      if (!mapa[item.itemCod]) {
        mapa[item.itemCod] = {
          itemCod: item.itemCod,
          descricao: item.descricao,
          qtd: 0,
          totalVendaSimp: 0,
        };
      }

      mapa[item.itemCod].qtd += qtd;
      mapa[item.itemCod].totalVendaSimp += totalVendaSimp;
    });
    const sortedData = Object.values(mapa);
    return sortedData.sort((a, b) => b.totalVendaSimp - a.totalVendaSimp);
  }

  function agrupaKits(data: any[]) {
    const mapa: Record<string, GeralData> = {};

    data = data.filter(
      (f) =>
        (f.itemCod.startsWith("14") || f.itemCod.startsWith("18")) &&
        f.itemCod.length == 6,
    );

    data.forEach((item) => {
      const qtd = item.qtd;
      const totalVendaSimp = item.totalVendaSimp;

      if (!mapa[item.itemCod]) {
        mapa[item.itemCod] = {
          itemCod: item.itemCod,
          descricao: item.descricao,
          qtd: 0,
          totalVendaSimp: 0,
        };
      }

      mapa[item.itemCod].qtd += qtd;
      mapa[item.itemCod].totalVendaSimp += totalVendaSimp;
    });

    let sortedData = Object.values(mapa).sort(
      (a, b) => b.totalVendaSimp - a.totalVendaSimp,
    );

    return sortedData;
  }

  const agrupaMes = (dados: any[]): TipoItem[] => {
    const mapaTipos = new Map<string, TipoItem>();

    dados.forEach((item) => {
      // Fallbacks para caso os campos venham vazios
      const tipoNome = item.itemCod;
      const grupoNome = item.descricao;

      const dataObj = new Date(item.data);
      const mesIndex = dataObj.getMonth(); // 0 a 11

      const valor = item.totalVendaSimp || 0;
      const quantidade = item.qtd || 0;

      // 1. Inicializa o Tipo Item se não existir
      if (!mapaTipos.has(tipoNome)) {
        mapaTipos.set(tipoNome, {
          id: tipoNome,
          nome: grupoNome,
          valoresMensais: new Array(12).fill(0),
          quantidadesMensais: new Array(12).fill(0),
          grupos: [],
        });
      }

      const tipoItem = mapaTipos.get(tipoNome)!;

      // Soma o valor e a quantidade no total do Tipo Item
      tipoItem.valoresMensais[mesIndex] += valor;
      tipoItem.quantidadesMensais[mesIndex] += quantidade;

      // 2. Busca ou inicializa o Grupo de Estoque dentro do Tipo Item
      let grupo = tipoItem.grupos.find((g) => g.nome === grupoNome);
      if (!grupo) {
        grupo = {
          id: `${tipoNome}-${grupoNome}`,
          nome: grupoNome,
          valoresMensais: new Array(12).fill(0),
          quantidadesMensais: new Array(12).fill(0),
        };
        tipoItem.grupos.push(grupo);
      }

      // Soma o valor e a quantidade no total do Grupo de Estoque específico
      grupo.valoresMensais[mesIndex] += valor;
      grupo.quantidadesMensais[mesIndex] += quantidade;
    });

    // Ordena alfabeticamente
    const resultado = Array.from(mapaTipos.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );

    resultado.forEach((tipo) => {
      tipo.grupos.sort((a, b) => a.nome.localeCompare(b.nome));
    });

    const sorted = resultado.sort((a, b) => {
      const totalA = a.valoresMensais.reduce((acc, val) => acc + val, 0);
      const totalB = b.valoresMensais.reduce((acc, val) => acc + val, 0);

      return totalB - totalA; // ordem decrescente (maior primeiro)
    });

    return sorted;
  };

  return (
    <AppPageHeader titleSlot="Dashboard Ranking de Produtos">
      <div className="p-2 bg-white flex flex-col">
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
        <DashboardsFilter onAplicar={handleGetData} />
        <div className="flex mb-2">
          <button
            onClick={handleSetViewGeral}
            className={cn(
              "border-b border-x border-x-transparent px-1.5 py-1 text-sm transition-all duration-75 hover:bg-neutral-50 hover:font-semibold hover:text-blue-600 min-w-[180px]",
              view == "geral" &&
                "hover:bg-black/70 hover:text-white border-x-neutral-200 border-t border-b-transparent rounded-tl-md rounded-tr-md bg-black text-white",
            )}
          >
            Produtos Geral
          </button>
          <button
            onClick={handleSetViewKits}
            className={cn(
              "border-b border-x border-x-transparent px-1.5 py-1 text-sm transition-all duration-75 hover:bg-neutral-50 hover:font-semibold hover:text-blue-600 min-w-[180px]",
              view == "kits" &&
                "hover:bg-black/70 hover:text-white border-x-neutral-200 border-t border-b-transparent rounded-tl-md rounded-tr-md  bg-black text-white",
            )}
          >
            Ranking Kits
          </button>
          <button
            onClick={handleSetViewMes}
            className={cn(
              "border-b border-x border-x-transparent px-1.5 py-1 text-sm transition-all duration-75 hover:bg-neutral-50 hover:font-semibold hover:text-blue-600 min-w-[180px]",
              view == "mes" &&
                "hover:bg-black/70 hover:text-white border-x-neutral-200 border-t border-b-transparent rounded-tl-md rounded-tr-md  bg-black text-white",
            )}
          >
            Produtos Geral Mês Qtd
          </button>
          <span className="border-b flex-1"></span>
        </div>
        <div
          className="overflow-auto"
          style={{
            maxWidth: "calc(100vw - 300px)",
            maxHeight: "calc(100vh - 220px)",
          }}
        >
          {view == "geral" ||
            (view == "kits" && (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-neutral-200 flex w-full">
                    <th className="w-[160px]  text-sm font-semibold border border-neutral-300">
                      Item
                    </th>
                    <th className="flex-1 text-sm font-semibold border border-neutral-300">
                      Descrição
                    </th>
                    <th className="w-[160px] text-sm font-semibold border border-neutral-300">
                      Qtde
                    </th>
                    <th className="w-[160px] text-sm font-semibold border border-neutral-300">
                      TotalVendaSImp
                    </th>
                    <th className="w-[11px]"></th>
                  </tr>
                </thead>
                <tbody
                  className="flex w-full flex-col overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 260px)" }}
                >
                  {tableData.map((row) => (
                    <tr
                      className="odd:bg-neutral-100 flex w-full"
                      key={`${row.itemCod}`}
                    >
                      <td className="w-[160px]  border p-1 text-sm">
                        {row.itemCod}
                      </td>
                      <td className="flex-1 border p-1 text-sm">
                        {row.descricao}
                      </td>
                      <td className="w-[160px]  border p-1 text-sm text-right">
                        {formatNumber(row.qtd, 0)}
                      </td>
                      <td className="w-[160px] border p-1 text-sm  text-right">
                        {formatNumber(row.totalVendaSimp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-neutral-200 flex w-full">
                    <th
                      colSpan={2}
                      className="flex-1 text-sm font-semibold border border-neutral-300 text-left"
                    >
                      Total
                    </th>
                    <th className="w-[160px] text-sm font-semibold border border-neutral-300 text-right px-1">
                      {formatNumber(
                        tableData.reduce((acc, b) => acc + b.qtd, 0),
                        0,
                      )}
                    </th>
                    <th className="w-[160px] text-sm font-semibold border border-neutral-300 text-right px-1">
                      {formatNumber(
                        tableData.reduce((acc, b) => acc + b.totalVendaSimp, 0),
                        0,
                      )}
                    </th>
                    <th className="w-[11px]"></th>
                  </tr>
                </tfoot>
              </table>
            ))}
          {view == "mes" && (
            <table className="table-fixed w-full text-xs">
              <thead className="border bg-neutral-200">
                <tr className="font-normal">
                  <th
                    rowSpan={2}
                    className="font-semibold w-[160px] border-r border-neutral-300"
                  >
                    Item
                  </th>
                  <th
                    rowSpan={2}
                    className="font-semibold w-[260px] border-r  border-neutral-300"
                  >
                    Descrição
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Jan
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Fev
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Mar
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Abr
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Mai
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Jun
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Jul
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Ago
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Set
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Out
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Nov
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Dez
                  </th>
                  <th
                    colSpan={2}
                    className="font-semibold border-r  border-neutral-300 w-[120px] border-b"
                  >
                    Total
                  </th>
                </tr>
                <tr className="">
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Qtd
                  </th>
                  <th className="w-[120px] text-right p-1 border-r  border-neutral-300 font-semibold">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {mesData.map((item) => (
                  <tr
                    key={item.id}
                    className="border odd:bg-neutral-100 hover:bg-neutral-200"
                  >
                    <td className="p-1 border-r">{item.id}</td>
                    <td className="p-1 border-r">{item.nome}</td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[0], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[0], 2)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[1], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[1], 2)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[2], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[2], 2)}
                    </td>

                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[3], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[3], 2)}
                    </td>

                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[4], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[4], 2)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[5], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[5], 2)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[6], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[6], 2)}
                    </td>

                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[7], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[7], 2)}
                    </td>

                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[8], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[8], 2)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[9], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[9], 2)}
                    </td>

                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[10], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[10], 2)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.quantidadesMensais[11], 0)}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(item.valoresMensais[11], 2)}
                    </td>

                    <td className="p-1 border-r text-right">
                      {formatNumber(
                        item.quantidadesMensais.reduce(
                          (acc: number, b: number) => acc + b,
                          0,
                        ),
                        0,
                      )}
                    </td>
                    <td className="p-1 border-r text-right">
                      {formatNumber(
                        item.valoresMensais.reduce(
                          (acc: number, b: number) => acc + b,
                          0,
                        ),
                        2,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border bg-neutral-200 border-neutral-300">
                  <th colSpan={2} className="border-r border-neutral-300">
                    Total
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0
                  </th>
                  <th className="w-[120px] text-right p-1 border-r border-neutral-300 font-semibold">
                    0,00
                  </th>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </AppPageHeader>
  );
}
