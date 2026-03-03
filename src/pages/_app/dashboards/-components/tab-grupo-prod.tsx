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
import type { TipoItem } from "./agrupamento-estoque";

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

const formatarMoeda = (valor: number) => {
  if (!valor) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const formatarNumero = (valor: number) => {
  if (!valor) return "";
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(
    valor,
  );
};

interface TabelaProps {
  dados: TipoItem[];
}

export const TabelaEstoqueMeses: React.FC<TabelaProps> = ({ dados }) => {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const toggleExpandir = (id: string) => {
    const novoSet = new Set(expandidos);
    if (novoSet.has(id)) novoSet.delete(id);
    else novoSet.add(id);
    setExpandidos(novoSet);
  };

  // Calcula os totais gerais (rodapé) para Valores e Quantidades
  const totaisGerais = useMemo(() => {
    const totaisValor = new Array(12).fill(0);
    const totaisQtd = new Array(12).fill(0);

    dados.forEach((tipo) => {
      tipo.valoresMensais.forEach((valor, index) => {
        totaisValor[index] += valor;
      });
      tipo.quantidadesMensais.forEach((qtd, index) => {
        totaisQtd[index] += qtd;
      });
    });

    return { totaisValor, totaisQtd };
  }, [dados]);

  return (
    <div
      className="rounded-md border overflow-auto"
      style={{
        maxHeight: "calc(100vh - 160px)",
        maxWidth: "calc(100vw - 300px)",
      }}
    >
      <Table className="min-w-max">
        <TableHeader className="bg-slate-100">
          <TableRow className="!text-xs">
            <TableHead
              rowSpan={2}
              className="align-middle border-r text-left font-bold min-w-[200px]"
            >
              Tipo Item
            </TableHead>
            <TableHead
              rowSpan={2}
              className="align-middle border-r text-left font-bold min-w-[200px]"
            >
              Grupo de Estoque
            </TableHead>
            {meses.map((mes) => (
              <TableHead
                key={mes}
                colSpan={2}
                className="text-center border-r font-bold "
              >
                {mes}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="!text-xs">
            {meses.map((mes) => (
              <React.Fragment key={`${mes}-sub`}>
                <TableHead className="text-right text-xs border-r">
                  Qtd
                </TableHead>
                <TableHead className="text-right text-xs border-r">
                  Valor
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {dados.map((tipo) => {
            const isExpandido = expandidos.has(tipo.id);

            return (
              <React.Fragment key={tipo.id}>
                {/* LINHA DO TIPO ITEM (Pai) */}
                <TableRow
                  className="hover:bg-neutral-200 cursor-pointer transition-colors !text-xs"
                  onClick={() => toggleExpandir(tipo.id)}
                >
                  <TableCell className="border-r font-bold flex items-center gap-2">
                    {isExpandido ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {tipo.nome}
                  </TableCell>
                  <TableCell className="border-r text-sm  font-medium"></TableCell>

                  {tipo.valoresMensais.map((valor, idx) => (
                    <React.Fragment key={`tipo-val-${idx}`}>
                      <TableCell className="text-right whitespace-nowrap font-semibold border-r">
                        {formatarNumero(tipo.quantidadesMensais[idx])}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap border-r font-semibold ">
                        {formatarMoeda(valor)}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>

                {/* LINHAS DOS GRUPOS DE ESTOQUE (Filhos) */}
                {isExpandido &&
                  tipo.grupos.map((grupo) => (
                    <TableRow
                      key={grupo.id}
                      className="bg-white hover:bg-slate-50 !text-xs"
                    >
                      <TableCell className="border-r bg-slate-50/30"></TableCell>
                      <TableCell className="border-r pl-6 whitespace-nowrap text-slate-700">
                        {grupo.nome}
                      </TableCell>

                      {grupo.valoresMensais.map((valor, idx) => (
                        <React.Fragment key={`grupo-val-${idx}`}>
                          <TableCell className="text-right whitespace-nowrap border-r">
                            {formatarNumero(grupo.quantidadesMensais[idx])}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap border-r">
                            {formatarMoeda(valor)}
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
            <TableCell colSpan={2} className="text-right border-r">
              Total Geral
            </TableCell>
            {totaisGerais.totaisValor.map((totalValor, idx) => (
              <React.Fragment key={`total-${idx}`}>
                <TableCell className="text-right whitespace-nowrap">
                  {formatarNumero(totaisGerais.totaisQtd[idx])}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap border-r">
                  {formatarMoeda(totalValor)}
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
