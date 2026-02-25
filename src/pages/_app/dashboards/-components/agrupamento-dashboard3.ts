export interface VendaRaw {
  id: number;
  categoriaProduto: string;
  descrCategoriaProduto: string;
  descrFamMat: string;
  data: string;
  qtd: number;
  valorTotalItem: number;
  pais: string;
  // ... adicione as outras propriedades conforme seu JSON
}

export interface VendaAgrupada {
  id: string;
  nivel: "pais" | "categoria" | "familia";
  nome: string;
  qtdAnoAnterior: number;
  valorAnoAnterior: number;
  qtdAnoAtual: number;
  valorAnoAtual: number;
  budget: number; // Como o budget não vem no JSON, será mockado ou precisa vir de outra fonte
  filhos?: VendaAgrupada[];
}

// Função para calcular as porcentagens e evitar divisão por zero
export const calcVariacao = (atual: number, anterior: number) => {
  if (anterior === 0) return atual > 0 ? 1 : 0;
  return atual / anterior - 1;
};

export const agruparDados = (dados: VendaRaw[]): VendaAgrupada[] => {
  const anoAtual = 2026;
  const arvore: Record<string, any> = {};

  dados.forEach((item) => {
    const anoItem = new Date(item.data).getFullYear();
    const isAtual = anoItem === anoAtual;
    const isAnterior = anoItem === anoAtual - 1;

    // Inicializa País
    if (!arvore[item.pais]) {
      arvore[item.pais] = {
        id: item.pais,
        nivel: "pais",
        nome: item.pais,
        qtdAnoAnterior: 0,
        valorAnoAnterior: 0,
        qtdAnoAtual: 0,
        valorAnoAtual: 0,
        budget: 0,
        filhos: {},
      };
    }

    // Inicializa Categoria
    if (!arvore[item.pais].filhos[item.descrCategoriaProduto]) {
      arvore[item.pais].filhos[item.descrCategoriaProduto] = {
        id: `${item.pais}-${item.descrCategoriaProduto}`,
        nivel: "categoria",
        nome: item.descrCategoriaProduto,
        qtdAnoAnterior: 0,
        valorAnoAnterior: 0,
        qtdAnoAtual: 0,
        valorAnoAtual: 0,
        budget: 0,
        filhos: {},
      };
    }

    // Inicializa Família
    if (
      !arvore[item.pais].filhos[item.descrCategoriaProduto].filhos[
        item.descrFamMat
      ]
    ) {
      arvore[item.pais].filhos[item.descrCategoriaProduto].filhos[
        item.descrFamMat
      ] = {
        id: `${item.pais}-${item.descrCategoriaProduto}-${item.descrFamMat}`,
        nivel: "familia",
        nome: item.descrFamMat,
        qtdAnoAnterior: 0,
        valorAnoAnterior: 0,
        qtdAnoAtual: 0,
        valorAnoAtual: 0,
        budget: 0,
      };
    }

    // Acumula os valores
    const nodes = [
      arvore[item.pais],
      arvore[item.pais].filhos[item.descrCategoriaProduto],
      arvore[item.pais].filhos[item.descrCategoriaProduto].filhos[
        item.descrFamMat
      ],
    ];

    nodes.forEach((node) => {
      if (isAtual) {
        node.qtdAnoAtual += item.qtd;
        node.valorAnoAtual += item.valorTotalItem;
      } else if (isAnterior) {
        node.qtdAnoAnterior += item.qtd;
        node.valorAnoAnterior += item.valorTotalItem;
      }
      // Mock de Budget para exemplo (você pode substituir pela sua lógica real)
      node.budget += item.valorTotalItem * 1.2;
    });
  });

  // Converte o objeto de objetos em array de arrays
  return Object.values(arvore).map((pais: any) => ({
    ...pais,
    filhos: Object.values(pais.filhos).map((cat: any) => ({
      ...cat,
      filhos: Object.values(cat.filhos),
    })),
  }));
};
