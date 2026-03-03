export interface VendaRaw {
  descrTipoProduto: string; // Será o nosso Tipo Item (Pai)
  nomeEstoque: string; // Será o nosso Grupo de Estoque (Filho)
  data: string;
  totalVendaSimp: number;
  qtd: number; // Nova propriedade necessária
}

// Agora a estrutura base guarda as duas métricas
export interface BaseMetricas {
  valoresMensais: number[];
  quantidadesMensais: number[];
}

export interface GrupoEstoque extends BaseMetricas {
  id: string;
  nome: string;
}

export interface TipoItem extends BaseMetricas {
  id: string;
  nome: string;
  grupos: GrupoEstoque[];
}

export const agruparVendasPorTipoItem = (dados: any[]): TipoItem[] => {
  const mapaTipos = new Map<string, TipoItem>();

  dados.forEach((item) => {
    // Fallbacks para caso os campos venham vazios
    const tipoNome =
      `${item.categoriaProduto} - ${item.descrCategoriaProduto?.trim()}` ||
      "Sem Tipo Definido";
    const grupoNome =
      `${item.grpEstoque} - ${item.nomeEstoque?.trim()}` ||
      "Sem Grupo Definido";
    const dataObj = new Date(item.data);
    const mesIndex = dataObj.getMonth(); // 0 a 11

    const valor = item.totalVendaSimp || 0;
    const quantidade = item.qtd || 0;

    // 1. Inicializa o Tipo Item se não existir
    if (!mapaTipos.has(tipoNome)) {
      mapaTipos.set(tipoNome, {
        id: tipoNome,
        nome: tipoNome,
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

  return resultado;
};
