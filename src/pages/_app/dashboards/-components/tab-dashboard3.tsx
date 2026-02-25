import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Ajuste o caminho conforme sua instalação do shadcn
import { type VendaAgrupada, calcVariacao } from "./agrupamento-dashboard3";

// Formatadores
const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    valor,
  );

const formatarPercentual = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(valor);

interface TabelaProps {
  dadosArvore: VendaAgrupada[];
}

export const TabDashboard3: React.FC<TabelaProps> = ({ dadosArvore }) => {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const toggleExpandir = (id: string) => {
    const novoSet = new Set(expandidos);
    if (novoSet.has(id)) {
      novoSet.delete(id);
    } else {
      novoSet.add(id);
    }
    setExpandidos(novoSet);
  };

  // Transforma a árvore em uma lista plana para a tabela renderizar corretamente
  const linhasVisiveis = useMemo(() => {
    const achatarArvore = (
      nodes: VendaAgrupada[],
      paiExpandido = true,
    ): VendaAgrupada[] => {
      let resultado: VendaAgrupada[] = [];
      for (const node of nodes) {
        if (paiExpandido) {
          resultado.push(node);
          if (node.filhos) {
            const isExpandido = expandidos.has(node.id);
            resultado = resultado.concat(
              achatarArvore(node.filhos, isExpandido),
            );
          }
        }
      }
      return resultado;
    };
    return achatarArvore(dadosArvore);
  }, [dadosArvore, expandidos]);

  // Componente interno para as células de porcentagem com cor
  const CelulaPercentual = ({ valor }: { valor: number }) => {
    const corBg =
      valor < 0
        ? "bg-red-500/80 text-white"
        : valor > 0
          ? "bg-green-500/80 text-white"
          : "";
    return (
      <TableCell className={`text-right font-medium ${corBg}`}>
        {formatarPercentual(valor)}
      </TableCell>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>País / Categoria</TableHead>
            <TableHead className="text-right">Qtd Ano Anterior</TableHead>
            <TableHead className="text-right">R$ Ano Anterior</TableHead>
            <TableHead className="text-right">Qtd Ano Atual</TableHead>
            <TableHead className="text-right">R$ Ano Atual</TableHead>
            <TableHead className="text-right">% QTD</TableHead>
            <TableHead className="text-right">% Vendas</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right">% VendasAtual X BU</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhasVisiveis.map((linha) => {
            const percQtd = calcVariacao(
              linha.qtdAnoAtual,
              linha.qtdAnoAnterior,
            );
            const percVendas = calcVariacao(
              linha.valorAnoAtual,
              linha.valorAnoAnterior,
            );
            const percBudget = calcVariacao(linha.valorAnoAtual, linha.budget);
            const temFilhos = linha.filhos && linha.filhos.length > 0;

            // Define o recuo (indentação) baseado no nível
            const paddingLeft =
              linha.nivel === "categoria"
                ? "pl-8"
                : linha.nivel === "familia"
                  ? "pl-16"
                  : "pl-4";
            const fontWeight =
              linha.nivel === "pais"
                ? "font-bold"
                : linha.nivel === "categoria"
                  ? "font-semibold"
                  : "font-normal";

            return (
              <TableRow
                key={linha.id}
                className={
                  linha.nivel !== "familia"
                    ? "bg-slate-50/50 hover:bg-slate-100/50"
                    : ""
                }
              >
                <TableCell
                  className={`${paddingLeft} ${fontWeight} flex items-center gap-2 cursor-pointer`}
                  onClick={() => temFilhos && toggleExpandir(linha.id)}
                >
                  {
                    temFilhos ? (
                      expandidos.has(linha.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    ) : (
                      <span className="w-4" />
                    ) /* Espaçador se não tiver filhos */
                  }
                  {linha.nome}
                </TableCell>
                <TableCell className="text-right">
                  {linha.qtdAnoAnterior.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  {formatarMoeda(linha.valorAnoAnterior)}
                </TableCell>
                <TableCell className="text-right">
                  {linha.qtdAnoAtual.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  {formatarMoeda(linha.valorAnoAtual)}
                </TableCell>

                <CelulaPercentual valor={percQtd} />
                <CelulaPercentual valor={percVendas} />

                <TableCell className="text-right">
                  {formatarMoeda(linha.budget)}
                </TableCell>

                <CelulaPercentual valor={percBudget} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
