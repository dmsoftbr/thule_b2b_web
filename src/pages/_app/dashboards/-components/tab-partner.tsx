import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import type { RepresentanteComissao } from "./agrupamento-partner";

const meses = [
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

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    valor,
  );

interface TabelaProps {
  dados: RepresentanteComissao[];
}

export const TabelaComissoesMeses: React.FC<TabelaProps> = ({ dados }) => {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const toggleExpandir = (id: string) => {
    const novoSet = new Set(expandidos);
    if (novoSet.has(id)) novoSet.delete(id);
    else novoSet.add(id);
    setExpandidos(novoSet);
  };

  const totaisGerais = useMemo(() => {
    const totais = new Array(12).fill(0);
    dados.forEach((rep) => {
      rep.valoresMensais.forEach((valor: number, index: number) => {
        totais[index] += valor;
      });
    });
    return totais;
  }, [dados]);

  return (
    <div
      className="rounded-md border overflow-auto"
      style={{
        maxHeight: "calc(100vh - 230px)",
        maxWidth: "calc(100vw - 300px)",
      }}
    >
      <Table className="min-w-max">
        <TableHeader className="bg-slate-100">
          <TableRow className="!text-xs">
            <TableHead
              rowSpan={2}
              className="align-middle border-r text-left font-bold text-slate-800 min-w-[200px]"
            >
              Representante
            </TableHead>
            <TableHead
              rowSpan={2}
              className="align-middle border-r text-left font-bold text-slate-800 min-w-[200px]"
            >
              Cliente
            </TableHead>
            {meses.map((mes) => (
              <TableHead
                key={mes}
                colSpan={2}
                className="text-center border-r font-bold text-slate-800"
              >
                {mes}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            {meses.map((mes) => (
              <React.Fragment key={`${mes}-sub`}>
                <TableHead className="text-right text-xs">Valor</TableHead>
                <TableHead className="text-right text-xs border-r bg-slate-200/50">
                  1% Partner
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {dados.map((rep) => {
            const isExpandido = expandidos.has(rep.id);

            return (
              <React.Fragment key={rep.id}>
                {/* LINHA DO REPRESENTANTE (Pai - Clicável) */}
                <TableRow
                  className="hover:bg-slate-100 cursor-pointer bg-slate-50/80 transition-colors text-xs"
                  onClick={() => toggleExpandir(rep.id)}
                >
                  <TableCell className="border-r font-bold text-slate-800 flex items-center gap-2">
                    {isExpandido ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {rep.nome}
                  </TableCell>
                  <TableCell className="border-r text-sm text-slate-500 font-medium"></TableCell>

                  {rep.valoresMensais.map((valor: number, idx: number) => (
                    <React.Fragment key={`rep-val-${idx}`}>
                      {/* Removido o ternário que ocultava os zeros */}
                      <TableCell className="text-right whitespace-nowrap font-semibold">
                        {formatarMoeda(valor)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap border-r bg-slate-100/50 font-semibold text-slate-700">
                        {formatarMoeda(valor * 0.01)}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>

                {/* LINHAS DOS CLIENTES (Filhos) */}
                {isExpandido &&
                  rep.clientes.map((cli: any) => (
                    <TableRow
                      key={cli.id}
                      className="bg-white hover:bg-slate-50"
                    >
                      <TableCell className="border-r bg-slate-50/30"></TableCell>
                      <TableCell className="border-r pl-6 whitespace-nowrap text-slate-700">
                        {cli.nome}
                      </TableCell>

                      {cli.valoresMensais.map((valor: number, idx: number) => (
                        <React.Fragment key={`cli-val-${idx}`}>
                          {/* Removido o ternário que ocultava os zeros */}
                          <TableCell className="text-right whitespace-nowrap text-sm">
                            {formatarMoeda(valor)}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap border-r bg-slate-50/50 text-sm text-slate-600">
                            {formatarMoeda(valor * 0.01)}
                          </TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  ))}
              </React.Fragment>
            );
          })}
        </TableBody>

        {/* RODAPÉ */}
        <TableFooter className="bg-slate-200 font-bold text-slate-900">
          <TableRow className="!text-xs">
            <TableCell colSpan={2} className="text-right border-r uppercase">
              Total Geral
            </TableCell>
            {totaisGerais.map((totalMes, idx) => (
              <React.Fragment key={`total-${idx}`}>
                <TableCell className="text-right whitespace-nowrap">
                  {formatarMoeda(totalMes)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap border-r">
                  {formatarMoeda(totalMes * 0.01)}
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
